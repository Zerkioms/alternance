const db = require("../models");
const { Sequelize } = require("sequelize");
const { salles, associations } = require("../models");
const DataEquipementModel = require("../models/DataEquipement.model");
const TypeEquipementModel = require("../models/TypeEquipement.model");
const BatimentModel = require("../models/Batiment.model");
const Association = db.associations;
const ModeleEquipement = db.modele_equipement;
const DataEquipement = db.data_equipement;
const DataModele = db.data_modele;
const Caracteristiques = db.caracteristiques;
const TypeEquipement = db.type_equipement;
const Salle = db.salles;
const Batiment = db.batiments;
const Zone = db.zones;
const Op = db.Sequelize.Op;

exports.find_all = (req, res, next) => {
    //fetch associations with id_salle = id_salle
    const recherche_list = Association.findAll({
        include: [
            {
                model: Salle,
                include: [
                    {
                        model: Batiment,
                        include: [
                            {
                                model: Zone,
                            },
                        ]
                    },
                ],
            },
            { model: DataEquipement, include: [{ model: Caracteristiques }] },
            {
                model: ModeleEquipement,
                include: [
                    { model: DataModele, separate: true, include: [{ model: Caracteristiques }] },
                    { model: TypeEquipement }
                ],
            },
        ],
    });
    return recherche_list;
};