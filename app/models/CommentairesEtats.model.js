module.exports = (sequelize, Sequelize) => {
    const CommentairesEtats = sequelize.define("commentaires_etats", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            impact_salle: {
              type: Sequelize.STRING
            },
            etat: {
                type: Sequelize.INTEGER
            }
        },
        {
            tableName: 'commentaires_etats',
            createdAt: true,
            updatedAt: true,
        });

    return CommentairesEtats;
};
