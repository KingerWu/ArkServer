const Table = require("../table");
const mongoose = require('mongoose');

class SongTb extends Table.MongoDBTable {

    constructor() {
        this.id = "";
        this.name = "";
        this.artist = [];
        this.album_link = "";
        this.external_link = "";
        this.play_link = "";
        this.lyrics = [];
        this.copyright = false;
        this.belong = "";
        this.belong_id = "";
    }

    static tableName() {
        return "song_tb";
    }

    static tableDefinition() {
        return {
            name: String,
            artist: [
                {
                    name: String
                }
            ],
            album_link: String,
            external_link: String,
            play_link: String,
            lyrics: [
                [
                    String
                ]
            ],
            copyright: Boolean,
            belong: String,
            belong_id: String
        };
    }

    static create(obj) {
        return this.createOne({
            name: obj.name,
            artist: obj.artist,
            album_link: obj.album_link,
            external_link: obj.external_link,
            play_link: obj.play_link,
            lyrics: obj.lyrics,
            copyright: obj.copyright,
            belong: obj.belong,
            belong_id: obj.belong_id
        });
    }

    static findById(song_id) {
        return this.findOne({ _id: song_id });
    }

    static findByBelong(belong, belong_id) {
        return this.findOne({ belong: belong, belong_id: belong_id });
    }

    
    static updateById(song_id, lyrics, play_link) {
        return this.updateOne({ _id: song_id }, {
            lyrics: lyrics,
            play_link: play_link
        });
    }
}

module.exports = SongTb;