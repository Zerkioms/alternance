module.exports = (sequelize, Sequelize) => {
    const Caracteristiques = sequelize.define("caracteristiques", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            grandeur: {
                type: Sequelize.STRING,
                unique: true
            },
            type_valeur: {
                type: Sequelize.STRING
            },
            unite: {
                type: Sequelize.STRING
            },
            modifiable: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            valeur_default : {
                type: Sequelize.STRING
            },
            groupement : {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'caracteristiques',
            createdAt: true,
            updatedAt: true,
        });

    return Caracteristiques;
};
