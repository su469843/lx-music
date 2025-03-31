const mongoose = require('mongoose');
const logger = require('./logger');

// MongoDB连接URI
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  logger.error('请设置MONGODB_URI环境变量');
  process.exit(1);
}

// 连接数据库
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB连接成功');
  } catch (error) {
    logger.error('MongoDB连接失败', { error: error.message });
    process.exit(1);
  }
}

module.exports = { connectDB }; 