document.addEventListener('DOMContentLoaded', function() {
  const verifyTitle = document.getElementById('verifyTitle');
  const verifyIcon = document.getElementById('verifyIcon');
  const verifyMessage = document.getElementById('verifyMessage');
  const authActions = document.getElementById('authActions');
  
  // 获取URL中的token参数
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  
  if (!token) {
    showError('验证失败', '缺少验证令牌');
    return;
  }
  
  // 发送验证请求
  verifyEmail(token);
  
  async function verifyEmail(token) {
    try {
      const response = await fetch(`/api/auth/verify?token=${token}`, {
        method: 'GET'
      });
      
      const data = await response.json();
      
      if (response.ok) {
        showSuccess('验证成功', '您的邮箱已成功验证，现在可以登录使用API密钥了。');
      } else {
        showError('验证失败', data.message || '验证失败，请稍后重试');
      }
    } catch (error) {
      showError('验证失败', '服务器错误，请稍后重试');
      console.error('验证错误:', error);
    }
  }
  
  function showSuccess(title, message) {
    verifyTitle.textContent = title;
    verifyIcon.textContent = '✓';
    verifyIcon.className = 'verify-icon success';
    verifyMessage.textContent = message;
    authActions.style.display = 'flex';
    
    // 自动重定向到登录页面
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 3000); // 3秒后重定向
  }
  
  function showError(title, message) {
    verifyTitle.textContent = title;
    verifyIcon.textContent = '✗';
    verifyIcon.className = 'verify-icon error';
    verifyMessage.textContent = message;
    authActions.style.display = 'flex';
  }
}); 