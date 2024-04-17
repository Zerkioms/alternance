const db = require("../models");
const {Sequelize} = require("sequelize");
const Role = db.role;
const Op = db.Sequelize.Op;

exports.insert_role = (role) => {
    const created_role = Role.create(role);
    return created_role;
};

exports.find_all = (req, res, next) => {

    Role.findAll().then(role => {
        res.json(role);
    })
};

exports.find_by_id = (req, res, next, id) => {
    Role.findByPk(id).then(role => {
        res.json(role);
    })
};

exports.update_role = (req, res, next, id) => {
    Role.update(req.body, {
        where: { id: id }
    }).then(role => {
        res.json(role);
    })
};

exports.delete_role = (req, res, next, id) => {
    Role.destroy({
        where: { id: id }
    }).then(role => {
        res.json(role);
    })
};

exports.delete_all = (req, res, next) => {
    Role.destroy({
        where: {},
        truncate: false
    }).then(role => {
        res.json(role);
    })
};

exports.find_by_role = (req, res, next, role) => {
    Role.findOne({where: {role: role}}).then(role => {
        res.json(role);
    })
}

