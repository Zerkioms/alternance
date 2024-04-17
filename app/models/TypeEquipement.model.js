module.exports = (sequelize, Sequelize) => {
    const TypeEquipement = sequelize.define("type_equipement", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.STRING,
                unique: true,
            },
            icon: {
                type: Sequelize.STRING,
            }
        },
        {
            tableName: 'type_equipement',
            createdAt: true,
            updatedAt: true,
        });

    return TypeEquipement;
};
