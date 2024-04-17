module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.STRING
            },
            prenom: {
                type: Sequelize.STRING
            },
            uid: {
                type: Sequelize.STRING
            },
            pwd: {
                type: Sequelize.STRING
            },
        },
        {
            tableName: 'user',
            createdAt: true,
            updatedAt: true,
        });

    return User;
};
