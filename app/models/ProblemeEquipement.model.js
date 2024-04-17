module.exports = (sequelize, Sequelize) => {
    const ProblemeEquipement = sequelize.define("probleme_equipement", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            }
        },
        {
            tableName: 'probleme_equipement',
            createdAt: true,
            updatedAt: true,
        });

    return ProblemeEquipement;
};
