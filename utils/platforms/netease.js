const axios = require('axios');

const Netease = {
  name: '网易云音乐',

  async getMusicUrlByName(songName, quality) {
    try {
      // 搜索歌曲
      const searchResponse = await axios.get('https://music.163.com/api/search/get', {
        params: {
          s: songName,
          type: 1, // 1 表示搜索歌曲
          limit: 1
        }
      });

      const song = searchResponse.data.result.songs[0];
      if (!song) {
        throw new Error('未找到歌曲');
      }

      // 获取歌曲详情
      const detailResponse = await axios.get('https://music.163.com/api/song/detail', {
        params: {
          ids: song.id
        }
      });

      const songDetail = detailResponse.data.songs[0];
      if (!songDetail) {
        throw new Error('获取歌曲详情失败');
      }

      // 获取歌曲 URL
      const urlResponse = await axios.get('https://music.163.com/api/song/enhance/player/url', {
        params: {
          ids: song.id,
          br: quality === '320k' ? 320000 : 128000
        }
      });

      const songUrl = urlResponse.data.data[0].url;
      if (!songUrl) {
        throw new Error('获取歌曲 URL 失败');
      }

      return songUrl;
    } catch (error) {
      throw new Error(`获取网易云音乐 URL 失败: ${error.message}`);
    }
  }
};

module.exports = Netease; 