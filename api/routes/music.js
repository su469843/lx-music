const express = require('express');
const router = express.Router();
const logger = require('../../utils/logger');
const platforms = {
  netease: require('../../utils/platforms/netease'),
  qq: require('../../utils/platforms/qq'),
  kuwo: require('../../utils/platforms/kuwo'),
  kugou: require('../../utils/platforms/kugou')
};

/**
 * 获取音乐 URL
 * POST /api/music/url
 */
router.post('/url', async (req, res) => {
  try {
    const { platform, songName, quality = '128k' } = req.body;

    if (!platform || !songName) {
      return res.status(400).json({
        success: false,
        message: '缺少必要参数: platform, songName'
      });
    }

    const platformHandler = platforms[platform.toLowerCase()];
    if (!platformHandler) {
      return res.status(400).json({
        success: false,
        message: `不支持的平台: ${platform}`
      });
    }

    logger.info('处理音乐 URL 请求', { platform, songName, quality });

    const url = await platformHandler.getMusicUrlByName(songName, quality);

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

module.exports = router; 