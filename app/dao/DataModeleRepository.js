const db = require("../models");
const {Sequelize} = require("sequelize");
const { data_modele } = require("../models");
const ModeleEquipement = db.modele_equipement;
const Caracteristiques = db.caracteristiques;
const Association = db.associations;
const Zone = db.zones;
const Batiments = db.batiments;
const Salle = db.salles;
const DataModele = db.data_modele;
const Op = db.Sequelize.Op;

exports.insert_data_modele = (data_modele) => {
    const created_data_modele = DataModele.create(data_modele);
    return created_data_modele;
};

exports.find_all = (req, res, next) => {

    let data_modele_list = DataModele.findAll();
    return data_modele_list;
};

exports.find_by_id = (req, res, next, id) => {
    let data_modele = DataModele.findByPk(id);
    return data_modele;
};

exports.update_data_modele = (req, res, next, id) => {
    let updated = DataModele.update(req.body, {
        where: { id: id }
    });
    return updated
};

exports.delete_data_modele = (req, res, next, id) => {
    let destroyed = DataModele.destroy({
        where: { id: id }
    });
    return destroyed
};


exports.delete_all = (req, res, next) => {
    let destroyed = DataModele.destroy({
        where: {},
        truncate: false
    });
    return destroyed;
};

exports.deleteCaracteristiquesByModele = (req, res, next, id_modele) => {
    let destroyed = DataModele.destroy({
        where: {id_modele_equipement: id_modele},
        truncate: false
    });
    return destroyed;
}

exports.fetchCaracteristiquesModele = (req, res, next, id_modele) => {
    let modele = ModeleEquipement.findByPk(id_modele,{
        include: [
            {model: DataModele, include: [Caracteristiques]},
            {model: Association, include: [Salle]},
        ]
    })
    return modele;
}


