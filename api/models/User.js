const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  adminPassword: { type: String }, // 后台管理密码
  token: { type: String }, // 用户令牌
  createdAt: { type: Date, default: Date.now } // 登记时间
});

module.exports = mongoose.model('User', userSchema); 