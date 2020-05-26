const musicApi = require("@suen/music-api");
musicApi.netease.searchSong({
    keyword: '周杰伦'
}).then(data => {
    console.log(data.data.songs[0]);
    musicApi.netease.getSongUrl(data.data.songs[0].id).then(data => {
        console.log(JSON.stringify(data));
    });
    musicApi.netease.getLyric(data.data.songs[0].id).then(data => {
        console.log(JSON.stringify(data));
    });
});
