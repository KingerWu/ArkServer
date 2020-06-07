const express = require('express');
const router = express.Router();
const Model = require("../../model");
const Utils = require("../../utils/utils");

router.use('/users/:user/*', Utils.asyncWrapper(async function (req, res, next) {
    let user = req.params.user;
    let result = await Model.UserTb.findOne({ name: user });
    if (result) {
        req.user = result;
        next();
    }
    else {
        Model.ErrorMap.UserNameNotExist.toResponse(res);
    }
}));

router.use('/users/:user/favs/:fav_id', Utils.asyncWrapper(async function (req, res, next) {
    let user = req.user;
    let fav_id = parseInt(req.params.fav_id);
    let result = await Model.FavTb.findOne({ id: fav_id, user_id: user.id });
    if (result) {
        req.fav = result;
        next();
    }
    else {
        Model.ErrorMap.FavNotExist.toResponse(res);
    }
}));

router.get('/users/:user/favs', Utils.asyncWrapper(async function (req, res) {
    let user = req.user;
    let offset = req.offset;
    let limit = req.limit;

    let results = await Model.FavTb.findMany({ user_id: user.id }, offset, limit);
    if (results) {
        let json = [];
        results.forEach(result => {
            json.push({
                "id": result.id,
                "name": result.name,
            });
        });
        res.status(200);
        res.json(json);
    } else {
        res.json([]);
    }
}));
router.post('/users/:user/favs', Utils.asyncWrapper(async function (req, res) {
    let user = req.user;
    let name = req.body.name;

    // 收藏列表正则，4到16位（字母，数字，下划线）
    let namePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (namePattern.test(name)) {
        // 检查是否存在
        let result = await Model.FavTb.findOne({ user_id: user.id, name: name });
        if (result) {
            Model.ErrorMap.FavExist.toResponse(res);
        }
        else {
            let result = await Model.FavTb.create(user.id, name);
            if (result) {
                res.status(201);
                res.json({
                    "id": result.id,
                    "name": result.name
                });
            }
        }
    }
    else {
        Model.ErrorMap.FavInconformity.toResponse(res);
    }
}));

router.put('/users/:user/favs/:fav_id', Utils.asyncWrapper(async function (req, res) {
    let user = req.user;
    let fav = req.fav;
    let name = req.body.name;

    // 收藏列表正则，4到16位（字母，数字，下划线）
    let namePattern = /^[a-zA-Z0-9_]{4,16}$/;
    if (namePattern.test(name)) {
        await Model.FavTb.update(fav, name);
        res.status(201);
        res.json({
            "id": fav.id,
            "name": name
        });
    }
    else {
        Model.ErrorMap.FavInconformity.toResponse(res);
    }
}));


router.delete('/users/:user/favs/:fav_id', Utils.asyncWrapper(async function (req, res) {
    let fav = req.fav;
    await Model.FavTb.delete(fav);
    res.status(204);
    res.end();
}));

router.get('/users/:user/favs/:fav_id/songs', Utils.asyncWrapper(async function (req, res) {
    let fav = req.fav;
    let offset = req.offset;
    let limit = req.limit;

    let results = await Model.FavSongTb.findMany({ fav_id: fav.id }, offset, limit);
    if (results) {
        let jsonResults = [];

        results.forEach(result => {
            let jsonArtist = [];
            result.artist.forEach(artist => {
                jsonArtist.push({
                    "name": artist.name
                });
            })

            jsonResults.push({
                "fav_id": result.fav_id,
                "name": result.name,
                "artist": jsonArtist,
                "song_id": result.song_id
            });
        });

        res.status(200);
        res.json(jsonResults);
    } else {
        res.json([]);
    }
}));

router.post('/users/:user/favs/:fav_id/songs', Utils.asyncWrapper(async function (req, res) {
    let fav = req.fav;
    let song_id = req.body.song_id;


    let result = await Model.FavSongTb.findOne({ fav_id: fav.id, song_id: song_id });
    if (result) {
        Model.ErrorMap.SongAlreadyInFav.toResponse(res);
    }
    else {
        // 查询歌曲信息
        let song = await Model.SongTb.findById(song_id);
        let favSong = await Model.FavSongTb.create(fav.id, song);
        let jsonArtist = [];
        favSong.artist.forEach(artist => {
            jsonArtist.push({
                "name": artist.name
            });
        })

        res.status(201);
        res.json({
            "fav_id": favSong.fav_id,
            "name": favSong.name,
            "artist": jsonArtist,
            "song_id": favSong.song_id
        });
    }
}));

router.delete('/users/:user/favs/:fav_id/songs/:song_id', Utils.asyncWrapper(async function (req, res) {
    let fav = req.fav;
    let song_id = req.params.song_id;

    let result = await Model.FavSongTb.findOne({ fav_id: fav.id, song_id: song_id });
    if (result) {
        Model.FavSongTb.delete(fav.id, song_id).then(() => {
            res.status(204);
            res.end();
        });
    }
    else {
        Model.ErrorMap.SongNotExist.toResponse(res);
    }
}));

module.exports = router;