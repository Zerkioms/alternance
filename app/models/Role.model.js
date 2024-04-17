module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("role", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            role: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'role',
            createdAt: true,
            updatedAt: true,
        });

    return Role;
};
