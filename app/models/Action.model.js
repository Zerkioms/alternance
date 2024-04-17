module.exports = (sequelize, Sequelize) => {
    const Action = sequelize.define("action", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            description: {
                type: Sequelize.STRING
            },
            num_dt: {
                type: Sequelize.INTEGER
            }
        },
        {
            tableName: 'action',
            createdAt: true,
            updatedAt: true,
        });

    return Action;
};
