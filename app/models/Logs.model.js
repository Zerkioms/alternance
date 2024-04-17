const logs = require("./Zone.model.js");

module.exports = (sequelize, Sequelize) => {
    const Logs = sequelize.define("logs", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            table: {
                type: Sequelize.STRING,
            },
            type_action: {
                type: Sequelize.STRING,
            },
            id_resource: {
                type: Sequelize.INTEGER,
            },
        },
        {
            tableName: 'logs',
            createdAt: true,
            updatedAt: true,

        });

    return Logs;
};
