module.exports = (sequelize, Sequelize) => {
    const TypeAction = sequelize.define("type_action", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            intitule_action: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'type_action',
            createdAt: true,
            updatedAt: true,
        });

    return TypeAction;
};
