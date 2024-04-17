module.exports = (sequelize, Sequelize) => {
    const zone = require("./Zone.model.js");

    var Batiment = sequelize.define("batiment", {

            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            libelle_long: {
                type: Sequelize.STRING,
                unique: true
            },
            libelle_court: {
                type: Sequelize.STRING,
                unique: true
            },

        },
    {
            underscored: true,
            tableName: 'batiment',
            createdAt: true,
            updatedAt: true,
        });
    return Batiment;
};
