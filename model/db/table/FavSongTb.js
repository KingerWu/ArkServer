const Table = require("../table");
const mongoose = require('mongoose');

class FavSongTb extends Table.MongoDBTable {

    constructor() {
        this.id = "";
        this.fav_id = "";
        this.name = "";
        this.artist = [];
        this.song_id = "";
    }

    static tableName() {
        return "fav_song_tb";
    }

    static tableDefinition() {
        return {
            fav_id: String,
            name: String,
            artist: [
                {
                    name: String
                }
            ],
            song_id: String
        };
    }

    static create(fav_id, song) {
        return this.createOne({
            fav_id: fav_id,
            name: song.name,
            artist: song.artist,
            song_id: song._id
        });
    }

    static delete(fav_id, song_id) {
        return this.deleteOne({ fav_id: fav_id, song_id: song_id });
    }
}

module.exports = FavSongTb;