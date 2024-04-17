const db = require("../models");
const {Sequelize} = require("sequelize");
const { data_modele } = require("../models");
const TypeEquipement = db.type_equipement;
const ModeleEquipement = db.modele_equipement;
const DataModele = db.data_modele;
const Op = db.Sequelize.Op;

exports.insert_modele_equipement = (modele_equipement) => {
    const created_modele_equipement = ModeleEquipement.create(modele_equipement);
    return created_modele_equipement;
};

exports.find_all = (req, res, next) => {

    let modele_equipement_list = ModeleEquipement.findAll();
    return modele_equipement_list;
};

exports.find_by_id = (req, res, next, id) => {
   let modele_equipement = ModeleEquipement.findByPk(id)
   return modele_equipement;
};

exports.update_modele_equipement = (req, res, next, id) => {
    let updated = ModeleEquipement.update(req.body, {
        where: { id: id }
    })
    return updated;
};

exports.delete_modele_equipement = (req, res, next, id) => {
    let modele_equipement = ModeleEquipement.destroy({
        where: { id: id }
    })
    return modele_equipement;
};

exports.delete_all = (req, res, next) => {
    ModeleEquipement.destroy({
        where: {},
        truncate: false
    }).then(modele_equipement => {
        res.json(modele_equipement);
    })
};

exports.fetchModelesEquipements = (req, res, next) => {
    let modeles = ModeleEquipement.findAll({
        order: [
            ['marque', 'ASC'],
            ['modele', 'ASC'],
        ],
        include: [{ model: TypeEquipement },{ model: DataModele }]
    })
    return modeles;
}

exports.fetchModelesEquipementsByType = (id_type_equipement) => {
    let modeles = ModeleEquipement.findAll( {
        include: { model: TypeEquipement, where: {id: id_type_equipement}}
    })
    return modeles;
}
