const db = require("../models");
const {Sequelize} = require("sequelize");
const Zone = db.zones;
const Batiments = db.batiments;
const Op = db.Sequelize.Op;



exports.insert_zone = (zone) => {
    const created_zone = Zone.create(zone);
    return created_zone;
};

exports.find_all = () => {
    let zones_list = Zone.findAll({
        order: [
            ['libelle_court', 'ASC'],
        ],
        attributes: {
            include: [['id', 'id_zone']]
        },
        include: [{
            model: Batiments
        }]
    }

    );
    return zones_list;
};

exports.find_by_id = (id) => {
    let zone = Zone.findByPk(id, {
        attributes: {
            include: [['id', 'id_zone']]
        },
        include: [{
            model: Batiments,
            attributes: {
                include: [['id', 'id_batiment']]
            }
        }]
    })
    return zone
};

exports.update_zone = (req, res, next, id) => {
    let updated = Zone.update(req.body, {where: { id: id } } );
    return updated;
};

exports.delete_zone = (id) => {
    let destroyed = Zone.destroy({where: { id: id } } );
    return destroyed;
};

exports.delete_all = () => {
    let destroyed = Zone.destroy({where: {}, truncate: false});
    return destroyed;
};

exports.find_by_lc = (req, res, libelle_court) => {
    Zone.findAll({where: {libelle_court: req.body.libelle_court}}).then(zone => {
        res.json(zone);
        return zone;
    })
}

exports.find_by_ll = (req, res, libelle_long) => {
    Zone.findAll({where: {libelle_long: req.body.libelle_long}}).then(zone => {
        res.json(zone);
        return zone;
    })
}

