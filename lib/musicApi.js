const musicApi = require("@suen/music-api");

function searchSongByApi(api, key) {
    return new Promise((resolve, reject) => {
        api.searchSong({
            keyword: key
        }).then(data => {
            let results = [];
            if (data && data.status) {
                data.data.songs.forEach(song => {
                    let artists = [];
                    song.artists.forEach(artist => {
                        artists.push({
                            "name": artist.name
                        });
                    })


                    results.push({
                        "name": song.name,
                        "artist": artists,
                        "album_link": song.album.cover,
                        "external_link": song.link,
                        "copyright": song.cp,
                        "belong_id": song.id,
                        "belong": song.vendor,
                    });
                });
            }
            resolve(results);
        });
    });
}

function searchPlayLinkByApi(belong, belong_id) {
    return new Promise((resolve, reject) => {
        musicApi[belong].getSongUrl(belong_id).then(data => {
            if (data && data.status
                && data.data.url) {
                resolve(data.data.url);
            }
            else {
                resolve("");
            }
        });
    });
}

function searchLyricsByApi(belong, belong_id) {
    return new Promise((resolve, reject) => {
        musicApi[belong].getLyric(belong_id).then(data => {
            if (data && data.status
                && data.data.lyric) {
                resolve(data.data.lyric);
            }
            else {
                resolve([]);
            }
        });
    });
}

async function searchSong(key) {
    const neteaseData = await searchSongByApi(musicApi.netease, key);
    const qqData = await searchSongByApi(musicApi.qq, key);
    // const xiamiData = await searchSongByApi(musicApi.xiami, key);
    // return neteaseData.concat(qqData).concat(xiamiData);

    return neteaseData.concat(qqData);
}

async function searchLyricsAndPlayLink(belong, belong_id) {
    const lyrics = await searchLyricsByApi(belong, belong_id);
    const playLink = await searchPlayLinkByApi(belong, belong_id);

    return {
        "play_link": playLink,
        "lyrics": lyrics,
    }
}


module.exports = {
    searchSong,
    searchLyricsAndPlayLink,
    searchSongByApi,
    searchPlayLinkByApi,
    searchLyricsByApi
}