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

//Méthode d'insertion d'un enregistrement dans une table en base de données
exports.insert_association = (association) => {
  //create est une méthode de l'ORM sequelize executant une requête SQL pour réaliser une insertion en base
  const created_association = Association.create(association);
  return created_association;
};

//Méthode de recherche permettant de retrouver tous les enregistrements d'une table
exports.find_all = (req, res, next) => {
  const equipements = Association.findAll();
  return equipements;
};


//Il existe également une méthode FindByPk permettant de récupérer un unique enregistrement en fonction de son ID en base.
exports.find_by_id = (req, res, next, id) => {
  const association = Association.findByPk(id, {
    attributes: {
      include: [["id", "id_equipement"]],
    },
    include: [
      {
        model: Salle,
        attributes: {
          include: [["id", "id_salle"]],
        },
        include: [
          {
            model: Batiment,
            attributes: {
              include: [["id", "id_batiment"]],
            },
            include: [
              {
                model: Zone,
                attributes: {
                  include: [["id", "id_zone"]],
                },
              },
              ],
          },
        ],
      },
      {
        model: ModeleEquipement,
        include: [
          { model: DataModele, separate: true, include: [{ model: Caracteristiques }] },
          {
            model: TypeEquipement,
          },
          ],
      },
      { model: DataEquipement, include: [{ model: Caracteristiques }] },
    ]
  });
 return association
};

//La méthode update permet de mettre à jour un enregistrement simplement en indiquant l'id de l'enregistrement à modifier.
exports.update_association = (req, id) => {
  let updated = Association.update(req.body, {
    where: { id: id },
  })
  return updated;
};

/*Il existe aussi la méthode destroy permettant de détruire un ou plusieurs enregistrement selon une condition.
 * Si aucune condition n'est indiquée, alors la méthode détruira tous les enregistrements de la table concernée.
 */
exports.delete_association = (req, res, next, id) => {
  req.params.id = id;
  const destroyed = Association.destroy({
    where: { id: id },
  });
  return destroyed;
};

exports.delete_all = (req, res, next) => {
  Association.destroy({
    where: {},
    truncate: false,
  }).then((association) => {
    res.json(association);
  });
};

exports.fetchAssociationsEquipement = (req, res, next, id_salle) => {
  //fetch associations with id_salle = id_salle
  const equipements_list = Salle.findByPk(id_salle, {
    logging : console.log,
    attributes: {
      include: [["id", "id_salle"]],
    },
    include: [
      {
        model: Batiment,
        include: [
          {
            model: Zone,
          },
        ],
      },
      {
        model: Association,
        include: [
          { model: DataEquipement, include: [{ model: Caracteristiques }] },
          {
            model: ModeleEquipement,
            include: [
              { model: DataModele, separate: true, include: [{ model: Caracteristiques }] },
              {model: TypeEquipement}
            ],
          },
        ],
      },
    ],
  });
  return equipements_list;
};

exports.fetchSallebyEquipement = (req, res, next, id) => {
  let salle = Association.findAll({
    where : {id_modele_equipement: id}, 
      include: [
      {
          model: Salle, 
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
      }
  ]})
      return salle;
}