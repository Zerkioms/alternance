module.exports = (sequelize, Sequelize) => {
    const Zone = sequelize.define("zone", {
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
            tableName: 'zone',
            createdAt: true,
            updatedAt: true,

        });

    return Zone;
};
