module.exports = (sequelize, Sequelize) => {
    const Traitement = sequelize.define("traitement", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            traitement: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'traitement',
            createdAt: true,
            updatedAt: true,
        });

    return Traitement;
};
