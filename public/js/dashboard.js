document.addEventListener('DOMContentLoaded', function() {
  const userEmail = document.getElementById('userEmail');
  const verificationStatus = document.getElementById('verificationStatus');
  const apiKeyInput = document.getElementById('apiKeyInput');
  const copyButton = document.getElementById('copyButton');
  const logoutButton = document.getElementById('logoutButton');
  
  // 检查是否已登录
  const token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  // 获取用户信息
  async function fetchUserInfo() {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取用户信息失败');
      }
      
      const data = await response.json();
      
      // 更新页面信息
      userEmail.textContent = data.data.email;
      verificationStatus.textContent = '已验证';
      verificationStatus.className = 'value verified';
      apiKeyInput.value = data.data.apiKey;
      
    } catch (error) {
      console.error('获取用户信息错误:', error);
      
      // 显示错误信息
      userEmail.textContent = '获取失败';
      verificationStatus.textContent = '获取失败';
      apiKeyInput.value = '';
      
      // 提供重试选项
      const retryButton = document.createElement('button');
      retryButton.textContent = '重试';
      retryButton.className = 'btn btn-secondary';
      retryButton.addEventListener('click', fetchUserInfo);
      
      apiKeyInput.parentNode.appendChild(retryButton);
    }
  }
  
  // 复制API密钥
  copyButton.addEventListener('click', async function() {
    try {
      await navigator.clipboard.writeText(apiKeyInput.value);
      
      // 显示复制成功提示
      copyButton.textContent = '已复制!';
      setTimeout(() => {
        copyButton.textContent = '复制';
      }, 2000);
    } catch (err) {
      console.error('无法复制:', err);
    }
  });
  
  // 退出登录
  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('apiKey');
    window.location.href = '/login.html';
  }
  
  logoutButton.addEventListener('click', logout);
  
  // 加载用户信息
  fetchUserInfo();
}); 