const db = require("../models");
const {Sequelize} = require("sequelize");
const Type_Usage = db.type_usage;
const Usages = db.liaison;
const Op = db.Sequelize.Op;

exports.insertUsage = (usage) => {
    let created_usage = Usages.create(usage);
    return created_usage;
}

exports.findAll = () => {
    let usages_list = Usages.findAll({
    });
    return usages_list
}

exports.findAllBySalle = (req, res, next, id_salle) => {
    let usages_list = Usages.findAll({
        where: {id_salle: id_salle},
        include: { model: Type_Usage }
    });
    return usages_list
}


exports.deleteUsage = (id) => {
    let destroyed = Usages.destroy({
        where: {id: id}
    })
    return destroyed
}