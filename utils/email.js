const axios = require('axios');
const logger = require('./logger');

// Resend API 密钥
const RESEND_API_KEY = process.env.EMAIL_PASSWORD || 're_YdGTqCzR_5ua53hCA9JQHmBrGMktEjamH';

/**
 * 发送验证邮件
 * @param {string} to - 收件人邮箱
 * @param {string} token - 验证令牌
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.BASE_URL || 'https://your-vercel-app.vercel.app'}/verify-email?token=${token}`;
  
  const emailData = {
    from: 'Music API <onboarding@resend.dev>',
    to,
    subject: '请验证您的邮箱',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6cf7;">验证您的邮箱</h2>
        <p>感谢您注册音乐API聚合服务。请点击下面的链接验证您的邮箱：</p>
        <p><a href="${verificationUrl}" style="display: inline-block; background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">验证邮箱</a></p>
        <p>或者复制以下链接到浏览器地址栏：</p>
        <p>${verificationUrl}</p>
        <p>此链接将在24小时后失效。</p>
        <p>如果您没有注册我们的服务，请忽略此邮件。</p>
      </div>
    `
  };
  
  try {
    const response = await axios.post('https://api.resend.com/emails', emailData, {
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    logger.info('验证邮件已发送', { to, id: response.data.id });
  } catch (error) {
    logger.error('发送验证邮件失败', { 
      error: error.response ? error.response.data : error.message, 
      to 
    });
    throw new Error('发送验证邮件失败');
  }
}

module.exports = {
  sendVerificationEmail
}; 