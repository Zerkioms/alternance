module.exports = (sequelize, Sequelize) => {
    const Liaison = sequelize.define("liaison", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
        },
        {
            tableName: 'liaison',
            createdAt: true,
            updatedAt: true,

        });

    return Liaison;
};
