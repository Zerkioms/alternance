module.exports = (sequelize, Sequelize) => {
    const ModeleEquipement = sequelize.define("modele_equipement", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            marque: {
                type: Sequelize.STRING
            },
            modele: {
                type: Sequelize.STRING,
                unique: true
            },
            dispo_vente: {
                type: Sequelize.BOOLEAN
            },
        },
        {
            tableName: 'modele_equipement',
            createdAt: true,
            updatedAt: true,
        });

    return ModeleEquipement;
};
