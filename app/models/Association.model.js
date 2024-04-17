module.exports = (sequelize, Sequelize) => {
    const Association = sequelize.define("association", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            libelle: {
                type: Sequelize.STRING
                },
            date_installation: {
                type: Sequelize.DATE
            },
            url_administration: {
                type: Sequelize.STRING
                },
            date_archivage: {
                type: Sequelize.DATE
            },
            status: {
                type: Sequelize.BOOLEAN
            }
        },
        {
            tableName: 'association',
            createdAt: true,
            updatedAt: true,
        });
    return Association;
};
