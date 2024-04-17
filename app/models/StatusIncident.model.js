module.exports = (sequelize, Sequelize) => {
    const StatusIncident = sequelize.define("status_incident", {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            intitule_status: {
                type: Sequelize.STRING
            }
        },
        {
            tableName: 'status_incident',
            createdAt: true,
            updatedAt: true,
        });

    return StatusIncident;
};
