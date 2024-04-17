const db = require("../models");
const {Sequelize, Association} = require("sequelize");
const DataEquipement = db.data_equipement;
const Caracteristiques = db.caracteristiques;
const Salle = db.salle;
const Op = db.Sequelize.Op;

//Méthode d'insertion d'un enregistrement dans une table en base de données
exports.insert_data_equipement = (data_equipement) => {
    //create est une méthode de l'ORM sequelize executant une requête SQL pour réaliser une insertion en base
    const created_data_equipement = DataEquipement.create(data_equipement);
    return created_data_equipement;
};

//Méthode de recherche permettant de retrouver tous les enregistrements d'une table
exports.find_all = (req, res, next) => {
    //FindAll est une méthode de l'ORM sequelize executant une requête SQL pour réaliser une recherche en base
    //Equivalente à un SELECT * from table
    DataEquipement.findAll().then(data_equipement => {
        res.json(data_equipement);
    })
};
/*La méthode FindAll peut également réaliser une recherche en base selon une condition, afin de ne sélectionner
*que les enregistrements que l'on souhaite.
* Elle propose également, s'il existe une association entre 2 tables, de récupérer la table référencée dans la clé
* étrangère.
* Equivalente à un Join. Des paramètres supplémentaires peuvent êtres ajoutés afin de le configurer en INNER JOIN, OUTER etc.
 */
exports.find_caracteristiques_by_equipement = (req, res, next, id) => {
    DataEquipement.findAll({where: {id_association: id}}).then(result => {
        if(result[0].id_caracteristiques !== undefined){
            Caracteristiques.findAll({where: {id: result[0].id_caracteristiques}}).then(caracteristiques => {
                res.json(caracteristiques);
            })
        }
    })
}
//Il existe également une méthode FindByPk permettant de récupérer un unique enregistrement en fonction de son ID en base.
exports.find_by_id = (req, res, next, id) => {
    DataEquipement.findByPk(id).then(data_equipement => {
        res.json(data_equipement);
    })
};

//create an update method
exports.update_data_equipement = (req, res, next, id) => {
    const updated = DataEquipement.update(req.body, {
        where: { id: id }
    })
    return updated;
};

/*Il existe aussi la méthode destroy permettant de détruire un ou plusieurs enregistrement selon une condition.
* Si aucune condition n'est indiquée, alors la méthode détruira tous les enregistrements de la table concernée.
 */
exports.delete_data_equipement = (req, res, next, id) => {
    const destroyed = DataEquipement.destroy({
        where: { id: id }
    })
    return destroyed;
};

exports.delete_all = (req, res, next) => {
    DataEquipement.destroy({
        where: {},
        truncate: false
    }).then(data_equipement => {
        res.json(data_equipement);
    })
};

exports.delete_data_equipement_by_association = (req, res, next, id_association) => {
    const destroyed = DataEquipement.destroy({
        where: { id_association: id_association }
    })
    return destroyed;
}