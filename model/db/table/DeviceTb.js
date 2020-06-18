const Table = require("../table");
const Sequelize = require('sequelize');

class DeviceTb extends Table.MySqlTable {
    constructor() {
        this.id = 0;
        this.key = "";
        this.token = "";
    }
    static tableName() {
        return "device_tb";
    }

    static tableDefinition() {
        return {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            key: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true
            },
            token: {
                type: Sequelize.STRING(100),
                allowNull: false
            }
        };
    }
}

module.exports = DeviceTb;