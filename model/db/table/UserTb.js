const Table = require("../table");
const Sequelize = require('sequelize');

class UserTb extends Table.MySqlTable {
    constructor() {
        this.id = 0;
        this.name = "";
        this.pass = "";
    }
    static tableName() {
        return "user_tb";
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
                allowNull: false,
                unique: true
            },
            pass: {
                type: Sequelize.STRING(20),
                allowNull: false
            }
        };
    }

    static register(user, pass) {
        return this.createOne({
            name: user,
            pass: pass
        })
    }
}

module.exports = UserTb;