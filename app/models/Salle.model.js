module.exports = (sequelize, Sequelize) => {
    const Salle = sequelize.define("salle", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            libelle: {
                type: Sequelize.STRING
            },
            etage: {
                type: Sequelize.INTEGER
            },
        },
        {
            tableName: 'salle',
            createdAt: true,
            updatedAt: true,
        });

    return Salle;
};
