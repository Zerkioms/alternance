const db = require("../models");
const {Sequelize} = require("sequelize");
const Type_Usage = db.type_usage;
const Op = db.Sequelize.Op;

exports.insertTypeUsage = (type_usage) => {
    let created_type_usage = Type_Usage.create(type_usage);
    return created_type_usage;
}

exports.findAll = () => {
    let type_usage_list = Type_Usage.findAll({
        order: [
            ['fonctionnalite', 'ASC'],
        ],
    });
    return type_usage_list
}

exports.updateTypeUsage = (req, id) => {
    let updated = Type_Usage.update(req.body, { where: {id: id}})
    return updated;
}

exports.deleteTypeUsage = (id) => {
    let destroyed = Type_Usage.destroy({
        where: {id: id}
    })
    return destroyed
}