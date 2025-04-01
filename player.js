/**
 * @name 音乐播放器
 * @description 使用 API 获取并播放音乐
 * @version 1.0.0
 */

// 调试模式开关
const DEV_ENABLE = true;

// 工具函数
const debugLog = (title, message) => {
  if (DEV_ENABLE) {
    console.log(`[调试] ${title}: ${message}`);
  }
};

// API 请求函数
const fetchMusicUrl = async (platform, songName, quality) => {
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
    if (!data.success) {
      throw new Error(data.message || '获取音乐 URL 失败');
    }

    return data.data.url;
  } catch (error) {
    debugLog('API 请求错误', error.message);
    throw error;
  }
};

// 播放音乐函数
const playMusic = (url) => {
  const audio = new Audio(url);
  audio.play();
  return audio;
};

// 主函数
const main = async () => {
  // 示例数据
  const platform = 'netease'; // 或 'qq', 'kuwo', 'kugou'
  const songName = '晴天'; // 替换为要搜索的歌曲名称
  const quality = '320k'; // 或 '128k', 'flac'

  try {
    debugLog('开始获取音乐 URL', `平台: ${platform}, 歌曲: ${songName}, 音质: ${quality}`);

    const musicUrl = await fetchMusicUrl(platform, songName, quality);
    debugLog('获取音乐 URL 成功', musicUrl);

    const audio = playMusic(musicUrl);
    debugLog('开始播放音乐', '');

    // 监听播放结束事件
    audio.addEventListener('ended', () => {
      debugLog('音乐播放结束', '');
    });

    // 监听错误事件
    audio.addEventListener('error', (e) => {
      debugLog('音乐播放错误', e.message);
    });

  } catch (error) {
    console.error('发生错误:', error.message);
  }
};

// 导出函数供外部使用
window.playMusicByName = async (platform, songName, quality = '320k') => {
  try {
    const musicUrl = await fetchMusicUrl(platform, songName, quality);
    return playMusic(musicUrl);
  } catch (error) {
    console.error('播放音乐失败:', error.message);
    throw error;
  }
};

// 运行主函数
main(); 