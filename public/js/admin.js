document.addEventListener('DOMContentLoaded', function() {
  const usersTable = document.getElementById('usersTable');
  const announcementForm = document.getElementById('announcementForm');
  const changePasswordForm = document.getElementById('changePasswordForm');
  const manageTokenForm = document.getElementById('manageTokenForm');
  const errorMessage = document.getElementById('errorMessage');

  // 获取登记记录
  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      
      if (response.ok) {
        const tbody = usersTable.querySelector('tbody');
        tbody.innerHTML = data.data.map(user => `
          <tr>
            <td>${user.email}</td>
            <td>${new Date(user.createdAt).toLocaleString()}</td>
            <td>${user.token || '无'}</td>
          </tr>
        `).join('');
      } else {
        alert('获取登记记录失败: ' + data.message);
      }
    } catch (error) {
      alert('获取登记记录失败: ' + error.message);
    }
  }

  // 设置公告
  announcementForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const announcement = document.getElementById('announcement').value;
    
    try {
      const response = await fetch('/api/admin/announcement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ announcement })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('公告设置成功');
      } else {
        errorMessage.textContent = data.message || '设置公告失败，请稍后重试';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = '服务器错误，请稍后重试';
      errorMessage.style.display = 'block';
      console.error('设置公告错误:', error);
    }
  });

  // 修改密码
  changePasswordForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    
    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('密码修改成功');
      } else {
        errorMessage.textContent = data.message || '修改密码失败，请稍后重试';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = '服务器错误，请稍后重试';
      errorMessage.style.display = 'block';
      console.error('修改密码错误:', error);
    }
  });

  // 管理令牌
  manageTokenForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const token = document.getElementById('token').value;
    
    try {
      const response = await fetch('/api/admin/manage-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, token })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('令牌更新成功');
        fetchUsers(); // 刷新登记记录
      } else {
        errorMessage.textContent = data.message || '更新令牌失败，请稍后重试';
        errorMessage.style.display = 'block';
      }
    } catch (error) {
      errorMessage.textContent = '服务器错误，请稍后重试';
      errorMessage.style.display = 'block';
      console.error('更新令牌错误:', error);
    }
  });

  // 初始化页面
  fetchUsers();
}); 