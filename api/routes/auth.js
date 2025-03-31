const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const { sendVerificationEmail } = require('../../utils/email');
const logger = require('../../utils/logger');

const router = express.Router();

// JWT密钥
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * 登记邮箱
 * POST /api/auth/register
 */
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;
    
    // 验证请求数据
    if (!email) {
      return res.status(400).json({
        success: false,
        message: '邮箱不能为空'
      });
    }
    
    // 检查邮箱是否已存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被登记'
      });
    }
    
    // 生成令牌
    const token = uuidv4();
    
    // 创建新用户
    const user = new User({ email, token });
    await user.save();
    
    res.json({
      success: true,
      data: { token },
      message: '邮箱登记成功'
    });
  } catch (error) {
    logger.error('登记邮箱失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '登记邮箱失败，请稍后重试'
    });
  }
});

/**
 * 验证邮箱
 * GET /api/auth/verify
 */
router.get('/verify', async (req, res) => {
  try {
    const { token } = req.query;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: '缺少验证令牌'
      });
    }
    
    // 查找用户
    const user = await User.findOne({
      verificationToken: token,
      verificationExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: '无效的验证令牌或令牌已过期'
      });
    }
    
    // 更新用户验证状态
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;
    
    await user.save();
    
    res.json({
      success: true,
      message: '邮箱验证成功'
    });
  } catch (error) {
    logger.error('邮箱验证失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '邮箱验证失败，请稍后重试'
    });
  }
});

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证请求数据
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码不能为空'
      });
    }
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 验证密码
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误'
      });
    }
    
    // 生成JWT令牌
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token,
        user: {
          email: user.email,
          apiKey: user.apiKey
        }
      }
    });
  } catch (error) {
    logger.error('用户登录失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '登录失败，请稍后重试'
    });
  }
});

/**
 * 获取用户信息
 * GET /api/auth/me
 */
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '未提供认证令牌'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    res.json({
      success: true,
      data: {
        email: user.email,
        apiKey: user.apiKey,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    logger.error('获取用户信息失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '获取用户信息失败'
    });
  }
});

module.exports = router; 