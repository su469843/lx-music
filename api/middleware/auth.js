const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../../utils/logger');

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * 验证JWT令牌
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: '未提供认证令牌'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error('令牌验证失败', { error: error.message });
    return res.status(403).json({
      success: false,
      message: '无效的认证令牌'
    });
  }
};

/**
 * 验证API密钥
 */
const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'] || req.query.apiKey;
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: '未提供API密钥'
    });
  }
  
  try {
    const user = await User.findOne({ apiKey, isVerified: true });
    
    if (!user) {
      return res.status(403).json({
        success: false,
        message: '无效的API密钥'
      });
    }
    
    req.user = { id: user._id, email: user.email };
    next();
  } catch (error) {
    logger.error('API密钥验证失败', { error: error.message });
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

module.exports = {
  authenticateToken,
  authenticateApiKey
}; 