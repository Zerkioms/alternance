const db = require("../models");
const {Sequelize} = require("sequelize");
const { salles } = require("../models");
const Batiment = db.batiments;
const Zone = db.zones;
const Salle = db.salles;
const Op = db.Sequelize.Op;

exports.insert_batiment = (batiment) => {
    const created_batiment = Batiment.create(batiment);
    return created_batiment;
};

exports.find_all = (req, res, next) => {
    const batiments = Batiment.findAll({
include: [
    {
        model: Zone
    }
]
    });
    return batiments;
};

//Il existe également une méthode FindByPk permettant de récupérer un unique enregistrement en fonction de son ID en base.
exports.find_by_id = (req, res, next, id) => {
    Batiment.findByPk(id).then(batiment => {
        res.json(batiment);
    })
};

//La méthode update permet de mettre à jour un enregistrement simplement en indiquant l'id de l'enregistrement à modifier.
exports.update_batiment = (req, res, next, id) => {
    let updated = Batiment.update(req.body, {
        where: { id: id }
    })
    return updated
};

/*Il existe aussi la méthode destroy permettant de détruire un ou plusieurs enregistrement selon une condition.
* Si aucune condition n'est indiquée, alors la méthode détruira tous les enregistrements de la table concernée.
 */
exports.delete_batiment = (req, res, next, id) => {
    let destroyed = Batiment.destroy({
        where: { id: id }
    })
    return destroyed
};


exports.delete_all = (req, res, next) => {
    let destroyed = Batiment.destroy({
        where: {},
        truncate: false
    })
    return destroyed;
};


exports.fetchBatimentsByZone = (req, res, next, id) => {
    let zone = Zone.findOne({where : {id: id}, 
        order: [
            [Batiment, 'libelle_court', 'ASC'],
        ],
        attributes: {
            include: [['id', 'id_zone']]
        },
        include: [
        {
            model: Batiment, 
            attributes: {
                include: [['id', 'id_batiment']],
            },
            
            include: [
                {
                    model: Salle
                }
            ]
        }
    ]})
        return zone;
}

