module.exports = (sequelize, Sequelize) => {
    const TypeSalle = sequelize.define("type_salle", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            designation: {
                type: Sequelize.STRING,
                unique: true
            },
        },
        {
            tableName: 'type_salle',
            createdAt: true,
            updatedAt: true,
        });

    return TypeSalle;
};
