const db = require("../models");
const { Sequelize } = require("sequelize");
const Logs = db.Log;

exports.find_all = () => {
    let logs_list = Logs.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],

});
    return logs_list;
}


