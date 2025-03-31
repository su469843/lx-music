document.addEventListener('DOMContentLoaded', function() {
  // 检查是否已登录
  const token = localStorage.getItem('token');
  const authButtons = document.querySelector('.auth-buttons');
  
  if (token && authButtons) {
    // 已登录，显示用户中心和退出按钮
    authButtons.innerHTML = `
      <a href="/dashboard.html" class="btn btn-outline">用户中心</a>
      <button id="logoutBtn" class="btn btn-secondary">退出</button>
    `;
    
    // 添加退出按钮事件
    document.getElementById('logoutBtn').addEventListener('click', function() {
      localStorage.removeItem('token');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('apiKey');
      window.location.reload();
    });
  }
  
  // Tab switching
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove active class from all buttons and panes
      tabBtns.forEach(b => b.classList.remove('active'));
      tabPanes.forEach(p => p.classList.remove('active'));
      
      // Add active class to current button
      this.classList.add('active');
      
      // Show the corresponding tab pane
      const tabId = this.getAttribute('data-tab');
      document.getElementById(`${tabId}-tab`).classList.add('active');
    });
  });
  
  // API Test functionality
  const testButton = document.getElementById('testButton');
  const resultElement = document.getElementById('result');
  const playerContainer = document.getElementById('player-container');
  const audioPlayer = document.getElementById('audio-player');
  
  if (testButton) {
    testButton.addEventListener('click', async function() {
      const platform = document.getElementById('platform').value;
      const musicId = document.getElementById('musicId').value;
      const quality = document.getElementById('quality').value;
      const apiKey = document.getElementById('apiKey').value || localStorage.getItem('apiKey');
      
      if (!musicId) {
        resultElement.textContent = '请输入音乐ID';
        playerContainer.style.display = 'none';
        return;
      }
      
      if (!apiKey) {
        resultElement.textContent = '请输入API密钥';
        playerContainer.style.display = 'none';
        return;
      }
      
      testButton.disabled = true;
      testButton.textContent = '获取中...';
      resultElement.textContent = '正在请求...';
      playerContainer.style.display = 'none';
      
      try {
        const response = await fetch('/api/music/url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': apiKey
          },
          body: JSON.stringify({
            platform,
            musicInfo: { id: musicId },
            quality
          })
        });
        
        const data = await response.json();
        
        // Format the JSON response
        resultElement.textContent = JSON.stringify(data, null, 2);
        
        // If successful, show the audio player
        if (data.success && data.data && data.data.url) {
          audioPlayer.src = data.data.url;
          playerContainer.style.display = 'block';
        } else {
          playerContainer.style.display = 'none';
        }
      } catch (error) {
        resultElement.textContent = `请求失败: ${error.message}`;
        playerContainer.style.display = 'none';
      } finally {
        testButton.disabled = false;
        testButton.textContent = '获取音乐链接';
      }
    });
  }
  
  // Add example music IDs for each platform
  const platform = document.getElementById('platform');
  const musicId = document.getElementById('musicId');
  
  if (platform && musicId) {
    const exampleIds = {
      'netease': '1824020871', // 网易云音乐示例ID
      'qq': '001Qu4I30eVFYb',  // QQ音乐示例ID
      'kuwo': '156483846',     // 酷我音乐示例ID
      'kugou': 'A7AD9E3CC5B4763CDB3C7D602B8F3F92' // 酷狗音乐示例ID
    };
    
    platform.addEventListener('change', function() {
      musicId.placeholder = `示例ID: ${exampleIds[this.value]}`;
    });
    
    // Set initial placeholder
    musicId.placeholder = `示例ID: ${exampleIds[platform.value]}`;
  }

  const searchForm = document.getElementById('searchForm');
  const resultElement = document.getElementById('result');
  const playerContainer = document.getElementById('playerContainer');
  const audioPlayer = document.getElementById('audioPlayer');

  searchForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const platform = document.getElementById('platform').value;
    const songName = document.getElementById('songName').value;
    const quality = document.getElementById('quality').value;

    try {
      const response = await fetch('/api/music/url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          platform,
          songName,
          quality
        })
      });

      const data = await response.json();

      if (data.success && data.data && data.data.url) {
        audioPlayer.src = data.data.url;
        playerContainer.style.display = 'block';
      } else {
        resultElement.textContent = data.message || '获取音乐 URL 失败';
        playerContainer.style.display = 'none';
      }
    } catch (error) {
      resultElement.textContent = `请求失败: ${error.message}`;
      playerContainer.style.display = 'none';
    }
  });
}); 