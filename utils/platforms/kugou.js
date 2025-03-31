const axios = require('axios');

const Kugou = {
  name: '酷狗音乐',

  async getMusicUrlByName(songName, quality) {
    try {
      // 搜索歌曲
      const searchResponse = await axios.get('http://mobilecdn.kugou.com/api/v3/search/song', {
        params: {
          format: 'json',
          keyword: songName,
          page: 1,
          pagesize: 1
        }
      });

      const song = searchResponse.data.data.info[0];
      if (!song) {
        throw new Error('未找到歌曲');
      }

      // 获取歌曲 hash
      const hash = song.hash;
      if (!hash) {
        throw new Error('获取歌曲 hash 失败');
      }

      // 获取歌曲 URL
      const urlResponse = await axios.get('http://trackercdn.kugou.com/i/v2/', {
        params: {
          hash: hash,
          key: '1234567890abcdef1234567890abcdef', // 示例 key
          pid: 1,
          behavior: 'play',
          cmd: 25,
          version: 9108
        }
      });

      const songUrl = urlResponse.data.url[0];
      if (!songUrl) {
        throw new Error('获取歌曲 URL 失败');
      }

      return songUrl;
    } catch (error) {
      throw new Error(`获取酷狗音乐 URL 失败: ${error.message}`);
    }
  }
};

module.exports = Kugou; 