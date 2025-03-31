const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const logger = require('../utils/logger');
const { connectDB } = require('../utils/db');
const { authenticateApiKey } = require('./middleware/auth');

// 导入平台模块
const netease = require('./platforms/netease');
const qq = require('./platforms/qq');
const kuwo = require('./platforms/kuwo');
const kugou = require('./platforms/kugou');

// 导入路由
const authRoutes = require('./routes/auth');

// 创建 Express 应用
const app = express();

// 连接数据库
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 平台映射
const platforms = {
  'netease': netease,
  'wy': netease,
  'qq': qq,
  'tx': qq,
  'kuwo': kuwo,
  'kw': kuwo,
  'kugou': kugou,
  'kg': kugou
};

// 认证路由
app.use('/api/auth', authRoutes);

// 路由: 获取支持的平台
app.get('/api/platforms', (req, res) => {
  const result = Object.values(platforms)
    .filter((platform, index, self) => 
      self.findIndex(p => p.code === platform.code) === index
    )
    .map(platform => ({
      code: platform.code,
      name: platform.name,
      qualities: platform.supportedQualities
    }));
  
  res.json({
    success: true,
    data: result
  });
});

// 路由: 获取音乐 URL (需要API密钥认证)
app.post('/api/music/url', authenticateApiKey, async (req, res) => {
  try {
    const { platform, musicInfo, quality = '128k' } = req.body;
    
    if (!platform || !musicInfo || !musicInfo.id) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: platform, musicInfo.id'
      });
    }
    
    const platformHandler = platforms[platform.toLowerCase()];
    
    if (!platformHandler) {
      return res.status(400).json({
        success: false,
        message: `不支持的平台: ${platform}`
      });
    }
    
    logger.info('处理音乐 URL 请求', { platform, musicId: musicInfo.id, quality, userId: req.user.id });
    
    const url = await platformHandler.getMusicUrl(musicInfo, quality);
    
    res.json({
      success: true,
      data: {
        url,
        platform: platformHandler.name,
        quality
      }
    });
  } catch (error) {
    logger.error('获取音乐 URL 失败', { error: error.message });
    
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// 首页
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: './public' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  logger.error('服务器错误', { error: err.message, stack: err.stack });
  
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 处理 Vercel 无服务器函数
module.exports = app; 