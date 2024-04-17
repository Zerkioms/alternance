const db = require("../models");
const {Sequelize} = require("sequelize");
const Document = db.documents;
const Salles = db.salles;
const Op = db.Sequelize.Op;



exports.insertDocument = (document) => {
    const created_document = Document.create(document);
    return created_document;
};

exports.deleteDocument = (id) => {
    let destroyed = Document.destroy({where: { id: id } } );
    return destroyed;
};

exports.findBySalle = (id) => {
    let documents = Document.findAll({where: {id_salle: id}});
    return documents;
}
exports.findByModele = (id) => {
    let documents = Document.findAll({where: {id_modele_equipement: id}});
    return documents;
}
exports.findByAssociation = (id) => {
    let documents = Document.findAll({where: {id_association: id}});
    return documents;
}

