const db = require("../models");
const {Sequelize} = require("sequelize");
const Caracteristique = db.caracteristiques;
const Op = db.Sequelize.Op;

exports.insert_caracteristique = (caracteristique) => {
    //FindAll est une méthode de l'ORM sequelize executant une requête SQL pour réaliser une recherche en base
    //Equivalente à un SELECT * from table
    const created_caracteristique = Caracteristique.create(caracteristique);
    return created_caracteristique;
};

exports.find_all = (req, res, next) => {

    let caracteristiques_list = Caracteristique.findAll({
            order: [
                ['groupement', 'ASC'],
                ['grandeur', 'ASC'],
            ],
        }  
    );
    return caracteristiques_list;
};

/*La méthode FindAll peut également réaliser une recherche en base selon une condition, afin de ne sélectionner
*que les enregistrements que l'on souhaite.
* Elle propose également, s'il existe une association entre 2 tables, de récupérer la table référencée dans la clé
* étrangère.
* Equivalente à un Join. Des paramètres supplémentaires peuvent êtres ajoutés afin de le configurer en INNER JOIN, OUTER etc.
 */
exports.find_all_non_modifiable = (req, res, next) => {

    let caracteristique_non_modifiable_list = Caracteristique.findAll({where: {modifiable: false}})
    return caracteristique_non_modifiable_list;
};
exports.find_all_modifiable = (req, res, next) => {

    let caracteristique_modifiable_list = Caracteristique.findAll({where: {modifiable: true}})
    return caracteristique_modifiable_list;
};
//Il existe également une méthode FindByPk permettant de récupérer un unique enregistrement en fonction de son ID en base.
exports.find_by_id = (req, res, next, id) => {
    let caracteristique = Caracteristique.findByPk(id);
    return caracteristique;
};

//La méthode update permet de mettre à jour un enregistrement simplement en indiquant l'id de l'enregistrement à modifier.
exports.update_caracteristique = (req, res, next, id) => {
    let updated = Caracteristique.update(req.body, {
        where: { id: id }
    })
    return updated;
};

/*Il existe aussi la méthode destroy permettant de détruire un ou plusieurs enregistrement selon une condition.
* Si aucune condition n'est indiquée, alors la méthode détruira tous les enregistrements de la table concernée.
 */
exports.delete_caracteristique = (req, res, next, id) => {
    let destroyed = Caracteristique.destroy({
        where: { id: id }
    })
    return destroyed;
};

exports.delete_all = (req, res, next) => {
    let destroyed = Caracteristique.destroy({
        where: {},
        truncate: false
    })
    return destroyed;
};

