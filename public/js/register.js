document.addEventListener('DOMContentLoaded', function() {
  const registerForm = document.getElementById('registerForm');
  const errorMessage = document.getElementById('errorMessage');
  
  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    // 清除之前的错误信息
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('邮箱登记成功');
        window.location.href = '/index.html';
      } else {
        // 显示错误信息
        errorMessage.textContent = data.message || '登记邮箱失败，请稍后重试';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = '服务器错误，请稍后重试';
      errorMessage.style.display = 'block';
      console.error('登记邮箱错误:', error);
    }
  });
}); 