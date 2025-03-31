const axios = require('axios');

const QQ = {
  name: 'QQ音乐',

  async getMusicUrlByName(songName, quality) {
    try {
      // 搜索歌曲
      const searchResponse = await axios.get('https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp', {
        params: {
          w: songName,
          n: 1
        }
      });

      const song = searchResponse.data.data.song.list[0];
      if (!song) {
        throw new Error('未找到歌曲');
      }

      // 获取歌曲 URL
      const urlResponse = await axios.get('https://u.y.qq.com/cgi-bin/musicu.fcg', {
        params: {
          data: JSON.stringify({
            req_0: {
              module: 'vkey.GetVkeyServer',
              method: 'CgiGetVkey',
              param: {
                guid: '1234567890',
                songmid: [song.mid],
                uin: '0',
                platform: '20'
              }
            }
          })
        }
      });

      const songUrl = urlResponse.data.req_0.data.midurlinfo[0].purl;
      if (!songUrl) {
        throw new Error('获取歌曲 URL 失败');
      }

      return `https://dl.stream.qqmusic.qq.com/${songUrl}`;
    } catch (error) {
      throw new Error(`获取QQ音乐 URL 失败: ${error.message}`);
    }
  }
};

module.exports = QQ; 