const express = require('express');
const User = require('../models/User');
const logger = require('../../utils/logger');

const router = express.Router();

/**
 * 获取所有登记记录
 * GET /api/admin/users
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-adminPassword');
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    logger.error('获取登记记录失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '获取登记记录失败，请稍后重试'
    });
  }
});

/**
 * 设置公告
 * POST /api/admin/announcement
 */
router.post('/announcement', async (req, res) => {
  try {
    const { announcement } = req.body;
    
    // 保存公告到数据库或文件
    // 这里假设我们有一个全局变量来存储公告
    global.announcement = announcement;
    
    res.json({
      success: true,
      message: '公告设置成功'
    });
  } catch (error) {
    logger.error('设置公告失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '设置公告失败，请稍后重试'
    });
  }
});

/**
 * 修改密码
 * POST /api/admin/change-password
 */
router.post('/change-password', async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    
    // 验证旧密码
    const admin = await User.findOne({ adminPassword: oldPassword });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: '旧密码错误'
      });
    }
    
    // 更新密码
    admin.adminPassword = newPassword;
    await admin.save();
    
    res.json({
      success: true,
      message: '密码修改成功'
    });
  } catch (error) {
    logger.error('修改密码失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '修改密码失败，请稍后重试'
    });
  }
});

/**
 * 管理令牌
 * POST /api/admin/manage-token
 */
router.post('/manage-token', async (req, res) => {
  try {
    const { email, token } = req.body;
    
    // 查找用户
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
    
    // 更新令牌
    user.token = token;
    await user.save();
    
    res.json({
      success: true,
      message: '令牌更新成功'
    });
  } catch (error) {
    logger.error('管理令牌失败', { error: error.message });
    res.status(500).json({
      success: false,
      message: '管理令牌失败，请稍后重试'
    });
  }
});

module.exports = router; 