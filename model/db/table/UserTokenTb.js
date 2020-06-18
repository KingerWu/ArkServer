const Table = require("../table");
const Sequelize = require('sequelize');

class UserTokenTb extends Table.MySqlTable {
    constructor() {
        this.id = 0;
        this.user_id = "";
        this.refresh_token = "";
    }
    static tableName() {
        return "user_token_tb";
    }

    static tableDefinition() {
        return {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            refresh_token: {
                type: Sequelize.TEXT,
                allowNull: false
            }
        };
    }

    static create(user_id, refresh_token) {
        return this.createOne({
            user_id: user_id,
            refresh_token: refresh_token
        })
    }

    static update(id, refresh_token) {
        return this.updateOne({ id: id }, {
            refresh_token: refresh_token
        });
    }

    static delete(user_id) {
        return this.deleteOne({ user_id: user_id });
    }
}

module.exports = UserTokenTb;