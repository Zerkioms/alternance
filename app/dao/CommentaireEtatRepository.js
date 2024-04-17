const db = require("../models");
const {Sequelize} = require("sequelize");
const Commentaire = db.commentaires_etats;
const Op = db.Sequelize.Op;

//Méthode d'insertion d'un enregistrement dans une table en base de données
exports.insert_commentaire = (commentaire) => {
    //create est une méthode de l'ORM sequelize executant une requête SQL pour réaliser une insertion en base
    const created_commentaire = Commentaire.create(commentaire);
    return created_commentaire;
};

exports.find_all = (req, res, next) => {
    //FindAll est une méthode de l'ORM sequelize executant une requête SQL pour réaliser une recherche en base
    //Equivalente à un SELECT * from table
    Commentaire.findAll().then(commentaire => {
        res.json(commentaire);
    })
};

//Il existe également une méthode FindByPk permettant de récupérer un unique enregistrement en fonction de son ID en base.
exports.find_by_id = (req, res, next, id) => {
    Commentaire.findByPk(id).then(commentaire => {
        res.json(commentaire);
    })
};
//La méthode update permet de mettre à jour un enregistrement simplement en indiquant l'id de l'enregistrement à modifier.
exports.update_commentaire = (req, res, next, id) => {
    Commentaire.update(req.body, {
        where: { id: id }
    }).then(commentaire => {
        res.json(commentaire);
    })
};

/*Il existe aussi la méthode destroy permettant de détruire un ou plusieurs enregistrement selon une condition.
* Si aucune condition n'est indiquée, alors la méthode détruira tous les enregistrements de la table concernée.
 */
exports.delete_commentaire = (req, res, next, id) => {
    Commentaire.destroy({
        where: { id: id }
    }).then(commentaire => {
        res.json(commentaire);
    })
};

exports.delete_all = (req, res, next) => {
    Commentaire.destroy({
        where: {},
        truncate: false
    }).then(commentaire => {
        res.json(commentaire);
    })
};

