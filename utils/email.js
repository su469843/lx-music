const nodemailer = require('nodemailer');
const logger = require('./logger');

// SMTP 配置
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
};

const transporter = nodemailer.createTransport(smtpConfig);

/**
 * 发送验证邮件
 * @param {string} to - 收件人邮箱
 * @param {string} token - 验证令牌
 * @returns {Promise<void>}
 */
async function sendVerificationEmail(to, token) {
  const verificationUrl = `${process.env.BASE_URL || 'https://your-vercel-app.vercel.app'}/verify-email?token=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || 'Music API <noreply@example.com>',
    to,
    subject: '请验证您的邮箱',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6cf7;">验证您的邮箱</h2>
        <p>感谢您登记音乐API聚合服务。请点击下面的链接验证您的邮箱：</p>
        <p><a href="${verificationUrl}" style="display: inline-block; background-color: #4a6cf7; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">验证邮箱</a></p>
        <p>或者复制以下链接到浏览器地址栏：</p>
        <p>${verificationUrl}</p>
        <p>此链接将在24小时后失效。</p>
        <p>如果您没有登记我们的服务，请忽略此邮件。</p>
      </div>
    `
  };
  
  try {
    await transporter.sendMail(mailOptions);
    logger.info('验证邮件已发送', { to });
  } catch (error) {
    logger.error('发送验证邮件失败', { error: error.message, to });
    throw new Error('发送验证邮件失败');
  }
}

module.exports = { sendVerificationEmail }; 