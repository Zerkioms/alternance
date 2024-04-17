module.exports = (sequelize, Sequelize) => {
    const DataModele = sequelize.define("data_modele", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            valeur: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'data_modele',
            createdAt: true,
            updatedAt: true,
        });

    return DataModele;
};
