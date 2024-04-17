const db = require("../models");
const {Sequelize} = require("sequelize");
const TypeSalle = db.type_salle;
const Op = db.Sequelize.Op;

exports.insert_type_salle = (type_salle) => {
    const created_type_salle = TypeSalle.create(type_salle);
    return created_type_salle;
};

exports.find_all = (req, res, next) => {

    let type_salle_list = TypeSalle.findAll()
    return type_salle_list;
};

exports.find_by_id = (req, res, next, id) => {
    let type_salle = TypeSalle.findByPk(id)
    return type_salle;
};

exports.find_by_designation = (req, res, next, designation) => {
    let type_salle = TypeSalle.findOne({where: {designation: designation}})
    return type_salle;
}

exports.update_type_salle = (req, res, next, id) => {
    let updated = TypeSalle.update(req.body, {
        where: { id: id }
    })
    return updated
};

exports.delete_type_salle = (req, res, next, id) => {
    let destroyed = TypeSalle.destroy({
        where: { id: id }
    })
    return destroyed
};

exports.delete_all = (req, res, next) => {
    let destroyed = TypeSalle.destroy({
        where: {},
        truncate: false
    })
    return destroyed;
};