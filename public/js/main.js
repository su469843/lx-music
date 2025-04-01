document.addEventListener('DOMContentLoaded', function() {
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