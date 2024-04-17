const db = require("../models");
const { Sequelize } = require("sequelize");
//get sequelize instance
const Salle = db.salles;
const Batiment = db.batiments;
const TypeSalle = db.type_salle;
const Associations = db.associations;
const Op = db.Sequelize.Op;
const Zone = db.zones;

exports.insert_salle = (salle) => {
  const created_salle = Salle.create(salle);
  return created_salle;
};

exports.find_all = (req, res, next) => {
  let salle_list = Salle.findAll({
    include: [
      {
          model: Batiment,
          include: [
            {
              model: Zone
          }
          ]
      }
  ]
  });
  return salle_list;
};

exports.find_by_id = (req, res, next, id) => {
  let salle = Salle.findByPk(id);
  return salle;
};

exports.update_salle = (req, res, next, id) => {
  let udpated = Salle.update(req.body, {
    where: { id: id },
  });
  return udpated;
};

exports.delete_salle = (req, res, next, id) => {
  let destroyed = Salle.destroy({
    where: { id: id },
  });
  return destroyed;
};

exports.delete_all = (req, res, next) => {
  let destroyed = Salle.destroy({
    where: {},
    truncate: false,
  });
  return destroyed;
};

exports.fetchSallesByBatiment = (req, res, next, id_batiment) => {
  let salle_list = Batiment.findByPk(id_batiment, {
    //include tables associations and type_salle
    order: [
      [Salle, 'libelle', 'ASC'],
  ],
    attributes: {
      include: [['id', 'id_batiment']]
    },

    include: [
      {
        model: Salle,
        attributes: {
          include: [['id', 'id_salle']],
        },
        include: [
            {
                model: Associations,
            },

            {
                model: TypeSalle,
            },
        ]
        },
        {
            model: Zone,
            attributes: {
                include: [['id', 'id_zone']]
            },
        }
    ],
  });
  return salle_list;
};

//fetch all salles of a batiment with the number of equipments in each salle then include the type of salle and the batiement and its zone
/*exports.fetchSallesByBatiment = (req, res, next, id_batiment) => {
    let salle_list = Salle.findAll({
        where: {
        id_batiment: id_batiment,
        },
        attributes: {
        include: [
            [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM association AS Asso WHERE Asso.id_salle = salle.id)`
            ),
            "nbreequipements",
            ],
        ],
        },
        include: [
        {
            model: TypeSalle,
            as: "type_salle",
        },
        {
            model: Batiment,
            as: "batiment",
            where: {
            id: id_batiment,
            },
        }
        
        ],
    });
    return salle_list;
    }*/
