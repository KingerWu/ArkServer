const express = require('express');
const router = express.Router();
const Model = require("../../model");
const MusicApi = require("../../lib/3rd/musicApi");
const Utils = require("../../utils/utils");

function saveSearchResult(result) {
    return new Promise((resolve, reject) => {
        Model.SongTb.findByBelong(result.belong, result.belong_id).then(song => {
            if (!song) {
                Model.SongTb.create(result).then(song => {
                    resolve(song);
                });
            }
            else {
                resolve(song);
            }
        })
    });
}


async function saveSearchResults(results) {
    let songs = [];
    for (let i = 0; i < results.length; i++) {
        let result = results[i];
        let song = await saveSearchResult(result);
        songs.push(song);
    }

    return songs;
}

function searchLyricsAndPlayLink(song) {
    return new Promise((resolve, reject) => {
        if (song.lyrics && song.lyrics.length > 0 && song.play_link) {
            resolve(song);
        }
        else {
            MusicApi.searchLyricsAndPlayLink(song.belong, song.belong_id).then(result => {
                song.lyrics = result.lyrics;
                song.play_link = result.play_link;

                // update to db
                Model.SongTb.updateById(song._id, result.lyrics, result.play_link).then(() => {
                    resolve(song);
                });
            });
        }
    });
}


router.get('/songs/search', Utils.asyncWrapper(async function (req, res) {
    let key = req.query.key;
    let results = await MusicApi.searchSong(key);
    if (results && results.length > 0) {
        // 存入数据库, 并返回内容
        let songs = await saveSearchResults(results);
        let jsonSongs = [];
        songs.forEach(song => {
            let jsonArtist = [];
            song.artist.forEach(artist => {
                jsonArtist.push({
                    "name": artist.name
                });
            })

            jsonSongs.push({
                "id": song._id,
                "name": song.name,
                "artist": jsonArtist,
                "copyright": song.copyright,
                "belong": song.belong
            });
        })
        res.status(200);
        res.json(jsonSongs);
    } else {
        res.status(200);
        res.json([]);
    }
}));

router.get('/songs/:song_id', Utils.asyncWrapper(async function (req, res) {
    let song_id = req.params.song_id;
    let song = await Model.SongTb.findById(song_id);
    // 判断是否需要更新歌词与播放地址
    let result = await searchLyricsAndPlayLink(song);
    let jsonArtist = [];
    result.artist.forEach(artist => {
        jsonArtist.push({
            "name": artist.name
        });
    })

    res.status(200);
    res.json({
        "id": result._id,
        "name": result.name,
        "artist": jsonArtist,
        "album_link": result.album_link,
        "external_link": result.external_link,
        "play_link": result.play_link,
        "lyrics": result.lyrics,
        "copyright": result.copyright,
        "belong": result.belong,
        "belong_id": result.belong_id
    });
}));

module.exports = router;