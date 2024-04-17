module.exports = (sequelize, Sequelize) => {
    const DataEquipement = sequelize.define("data_equipement", {
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
            tableName: 'data_equipement',
            createdAt: true,
            updatedAt: true,
        });

    return DataEquipement;
};
