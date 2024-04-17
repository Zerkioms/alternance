const db = require("../models");
const {Sequelize} = require("sequelize");
const Type_Equipement = db.type_equipement;
const Op = db.Sequelize.Op;

exports.insert_type_equipement = (type_equipement) => {
    let created_type_equipement = Type_Equipement.create(type_equipement);
    return created_type_equipement;
};

exports.find_all = () => {

    let type_equipement_list = Type_Equipement.findAll({
        order: [
            ['nom', 'ASC'],
        ],
    }

    );
    return type_equipement_list
};

exports.find_by_id = (id) => {
    let type_equipement = Type_Equipement.findByPk(id);
    return type_equipement;
};

exports.update_type_equipement = (req, id) => {
    let updated = Type_Equipement.update(req.body, { where: { id: id }});
    return updated;
};

exports.delete_type_equipement = (id) => {
    let destroyed = Type_Equipement.destroy({
        where: { id: id }
    });
    return destroyed;
};

exports.delete_all = () => {
    let destroyed = Type_Equipement.destroy({
        where: {},
        truncate: false
    });
    return destroyed;
};

