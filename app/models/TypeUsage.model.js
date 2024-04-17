module.exports = (sequelize, Sequelize) => {
    const UsagesSalles = sequelize.define("usages_salles", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fonctionnalite: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'usages_salles',
            createdAt: true,
            updatedAt: true,

        });

    return UsagesSalles;
};
