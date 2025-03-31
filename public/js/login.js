document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('errorMessage');
  
  // 检查是否已登录
  const token = localStorage.getItem('token');
  if (token) {
    window.location.href = '/dashboard.html';
    return;
  }
  
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // 清除之前的错误信息
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 登录成功，保存令牌和用户信息
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('apiKey', data.data.user.apiKey);
        
        // 重定向到用户中心
        window.location.href = '/dashboard.html';
      } else {
        // 显示错误信息
        errorMessage.textContent = data.message || '登录失败，请稍后重试';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = '服务器错误，请稍后重试';
      errorMessage.style.display = 'block';
      console.error('登录错误:', error);
    }
  });
}); 