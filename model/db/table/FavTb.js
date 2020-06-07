const Table = require("../table");
const Sequelize = require('sequelize');

class FavTb extends Table.MySqlTable {
    constructor() {
        this.id = 0;
        this.name = "";
        this.user_id = 0;
    }

    static tableName() {
        return "fav_tb";
    }

    static tableDefinition() {
        return {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: Sequelize.STRING(20),
                allowNull: false
            },
            user_id: Sequelize.INTEGER,
        };
    }

    static create(user_id, name) {
        return this.createOne({
            name: name,
            user_id: user_id
        })
    }

    static update(fav, name) {
        return this.updateOne({ id: fav.id }, {
            name: name,
        });
    }

    static delete(fav) {
        return this.deleteOne({ id: fav.id });
    }
}

module.exports = FavTb;