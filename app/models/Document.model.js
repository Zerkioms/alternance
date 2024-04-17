module.exports = (sequelize, Sequelize) => {
    const Document = sequelize.define("document", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nom: {
                type: Sequelize.STRING,
            },
            hash: {
                type: Sequelize.STRING(10000000),
            },
            type_document: {
                type: Sequelize.STRING,
            },
        },
        {
            tableName: 'document',
            createdAt: true,
            updatedAt: true,

        });

    return Document;
};
