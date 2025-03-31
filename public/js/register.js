document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // 清除之前的错误信息
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    // 验证密码
    if (password !== confirmPassword) {
      errorMessage.textContent = '两次输入的密码不一致';
      errorMessage.style.display = 'block';
      return;
    }
    
    if (password.length < 6) {
      errorMessage.textContent = '密码长度至少为6个字符';
      errorMessage.style.display = 'block';
      return;
    }
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // 注册成功，保存令牌和用户信息
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('userEmail', data.data.user.email);
        localStorage.setItem('apiKey', data.data.user.apiKey);
        
        // 直接重定向到用户中心
        window.location.href = '/dashboard.html';
      } else {
        // 显示错误信息
        errorMessage.textContent = data.message || '注册失败，请稍后重试';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = '服务器错误，请稍后重试';
      errorMessage.style.display = 'block';
      console.error('注册错误:', error);
    }
  });
}); 