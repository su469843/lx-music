const axios = require('axios');

const Kuwo = {
  name: '酷我音乐',

  async getMusicUrlByName(songName, quality) {
    try {
      // 搜索歌曲
      const searchResponse = await axios.get('http://search.kuwo.cn/r.s', {
        params: {
          all: songName,
          ft: 'music',
          itemset: 'web_2013',
          rformat: 'json',
          encoding: 'utf8',
          pn: 0,
          rn: 1
        }
      });

      const song = searchResponse.data.abslist[0];
      if (!song) {
        throw new Error('未找到歌曲');
      }

      // 获取歌曲 URL
      const urlResponse = await axios.get('http://antiserver.kuwo.cn/anti.s', {
        params: {
          type: 'convert_url',
          rid: song.MUSICRID,
          format: quality === 'flac' ? 'flac' : 'mp3',
          response: 'url'
        }
      });

      const songUrl = urlResponse.data;
      if (!songUrl) {
        throw new Error('获取歌曲 URL 失败');
      }

      return songUrl;
    } catch (error) {
      throw new Error(`获取酷我音乐 URL 失败: ${error.message}`);
    }
  }
};

module.exports = Kuwo; 