require('dotenv').config()

const DBconfig = require("../config/db.config")
const Sequelize = require("sequelize");
const sequelize = new Sequelize(DBconfig.database, DBconfig.username, DBconfig.password, {
  host: DBconfig.host,
  port: DBconfig.port,
  dialect: DBconfig.dialect,
  pool: DBconfig.pool
});

// checks the database connectivity
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.salles = require("./Salle.model.js")(sequelize, Sequelize);
db.batiments = require("./Batiment.model.js")(sequelize, Sequelize);
db.zones = require("./Zone.model.js")(sequelize, Sequelize);
db.associations = require("./Association.model.js")(sequelize, Sequelize);
db.caracteristiques = require("./Caracteristiques.model.js")(sequelize, Sequelize);
db.commentaires_etats = require("./CommentairesEtats.model.js")(sequelize, Sequelize);
db.data_equipement = require("./DataEquipement.model.js")(sequelize, Sequelize);
db.data_modele = require("./DataModele.model.js")(sequelize, Sequelize);
db.modele_equipement = require("./ModeleEquipement.model.js")(sequelize, Sequelize);
db.type_equipement = require("./TypeEquipement.model.js")(sequelize, Sequelize);
db.type_salle = require("./TypeSalle.model.js")(sequelize, Sequelize);
db.documents = require("./Document.model.js")(sequelize, Sequelize);
db.Log = require("../modules/express-sequelize-logger/src/model.js")('request_logs',false)(sequelize, Sequelize);
db.type_usage = require("./TypeUsage.model.js")(sequelize, Sequelize);
db.liaison = require("./Liaison.model.js")(sequelize, Sequelize)

db.user = require("./User.model.js")(sequelize, Sequelize);
db.role = require("./Role.model.js")(sequelize, Sequelize);

db.action = require("./Action.model.js")(sequelize, Sequelize);
db.type_action = require("./TypeAction.model.js")(sequelize, Sequelize);
db.traitement = require("./Traitement.model.js")(sequelize, Sequelize);
db.probleme_equipement = require("./ProblemeEquipement.model.js")(sequelize, Sequelize);
db.status_incident = require("./StatusIncident.model.js")(sequelize, Sequelize);

/*
***************************************************************************
* CLES ETRANGERES DES TABLES
 */

//Une zone géographique comprends plusieurs batiments
db.zones.hasMany(db.batiments, {foreignKey: 'id_zone', sourceKey: 'id'});
db.batiments.belongsTo(db.zones, {foreignKey: 'id_zone', sourceKey: 'id'});

//Un batiment possède plusieurs salles
db.batiments.hasMany(db.salles, {foreignKey: 'id_batiment', sourceKey: 'id'});
db.salles.belongsTo(db.batiments, {foreignKey: 'id_batiment', sourceKey: 'id'});


//Un type de salle (Salle de TP, Salle de cours, Amphi etc.) sert à definir le type de plusieurs salles
db.type_salle.hasMany(db.salles, {foreignKey: 'id_type_salle', sourceKey: 'id'});

//Un modèle d'équipement n'est rattaché qu'a un type d'équipement (Exemple: Samsung NEO QLED 75QN900A --> Télévision ET RIEN D'AUTRE
db.type_equipement.hasMany(db.modele_equipement, {foreignKey: 'id_type_equipement', sourceKey: 'id'});
db.modele_equipement.belongsTo(db.type_equipement, {foreignKey: 'id_type_equipement', sourceKey: 'id'});

//Une caractéristique (sans sa valeur) est partagée par plusieurs données de modèles d'équipement (Exemple: Exemple: luminosité (en Lumens) --> Epson 685wi 3LCD MAIS AUSSI Philips PPX120 Noir
db.caracteristiques.hasMany(db.data_modele, {foreignKey: 'id_caracteristiques', sourceKey: 'id'});
db.data_modele.belongsTo(db.caracteristiques, {foreignKey: 'id_caracteristiques', sourceKey: 'id'});


//Une caractéristique (sans sa valeur) est partagée par plusieurs données d'équipement effectif en salle
db.caracteristiques.hasMany(db.data_equipement, {foreignKey: 'id_caracteristiques', sourceKey:'id'});

//Un champ de données n'appartient qu'a un seul modèle et inversement un modèle ne possède qu'un seul champ de données
db.modele_equipement.hasMany(db.data_modele, {foreignKey: 'id_modele_equipement', sourceKey:'id'});
db.data_modele.belongsTo(db.modele_equipement, {foreignKey: 'id_modele_equipement', sourceKey:'id'});



/*
***************************************************************************
CLES ETRANGERES DE LA TABLE ASSOCIATION
* La table association sert à mettre en relation un modèle et les données qui lui son propres, avec les données spécifiques
* de l'équipement consulté (Par exemple: Un vidéo-projecteur sera le modèle Epson 685wi 3LCD et aura un certain nombre de données
* liées au modèle; Mais l'équipement présent en Salle de TP va peut etre posséder des données supplémentaires (ou en moins) comme
* le nombre d'heures restantes avant de changer son ampoule, sa distance focale etc.)
*
* La table association sert également à faire le lien entre un équipement et une salle en particulier
*/

db.salles.hasMany(db.associations, {foreignKey: 'id_salle', sourceKey:'id'});
db.modele_equipement.hasOne(db.associations, {foreignKey: 'id_modele_equipement', sourceKey:'id'});
db.associations.hasMany(db.data_equipement, {foreignKey: 'id_association', sourceKey:'id'});


db.associations.belongsTo(db.salles, {foreignKey: 'id_salle', sourceKey: 'id'});
db.associations.belongsTo(db.modele_equipement, {foreignKey: 'id_modele_equipement', sourceKey: 'id'});
db.data_equipement.belongsTo(db.associations, {foreignKey: 'id_association', sourceKey: 'id'});
db.data_equipement.belongsTo(db.salles, {foreignKey: 'id_salle', sourceKey: 'id'});

db.data_equipement.belongsTo(db.caracteristiques, {foreignKey: 'id_caracteristiques', sourceKey: 'id'});


db.salles.hasMany(db.data_equipement, {foreignKey: 'id_salle', sourceKey: 'id'});



db.salles.belongsTo(db.type_salle, {foreignKey: 'id_type_salle', sourceKey: 'id'});
db.data_modele.belongsTo(db.caracteristiques, {foreignKey: 'id_caracteristiques', sourceKey: 'id'});
db.data_modele.belongsTo(db.modele_equipement, {foreignKey: 'id_modele_equipement', sourceKey: 'id'});


/*
***************************************************************************
 */


db.role.hasMany(db.user, {foreignKey: 'id_role', sourceKey: 'id'});
db.user.belongsTo(db.role, {foreignKey: 'id_role', sourceKey: 'id'});


db.user.hasMany(db.action, {foreignKey: 'id_utilisateur', sourceKey: 'id'})
db.action.belongsTo(db.user, {foreignKey: 'id_utilisateur', sourceKey: 'id'});

db.type_action.hasMany(db.action, {foreignKey: 'id_type_action', sourceKey: 'id'})
db.action.belongsTo(db.type_action, {foreignKey: 'id_type_action', sourceKey: 'id'});

db.status_incident.hasMany(db.action, {foreignKey: 'id_status_incident', sourceKey: 'id'})
db.action.belongsTo(db.status_incident, {foreignKey: 'id_status_incident', sourceKey: 'id'});

db.associations.hasOne(db.action, {foreignKey: 'id_association', sourceKey: 'id'})
db.action.belongsTo(db.associations, {foreignKey: 'id_association', sourceKey: 'id'});

db.salles.hasMany(db.action, {foreignKey: 'id_salle', sourceKey: 'id'})
db.action.belongsTo(db.salles, {foreignKey: 'id_salle', sourceKey: 'id'});


db.action.hasOne(db.traitement, {foreignKey: 'id_action', sourceKey: 'id'})
db.traitement.belongsTo(db.action, {foreignKey: 'id_action', sourceKey: 'id'});

db.status_incident.hasOne(db.traitement, {foreignKey: 'id_action', sourceKey: 'id'})
db.traitement.belongsTo(db.status_incident, {foreignKey: 'id_action', sourceKey: 'id'});

db.user.hasMany(db.traitement, {foreignKey: 'id_action', sourceKey: 'id'})
db.traitement.belongsTo(db.user, {foreignKey: 'id_action', sourceKey: 'id'});

db.action.hasOne(db.probleme_equipement, {foreignKey: 'id_action', sourceKey: 'id'})
db.probleme_equipement.belongsTo(db.action, {foreignKey: 'id_action', sourceKey: 'id'});

db.associations.hasOne(db.probleme_equipement, {foreignKey: 'id_association', sourceKey: 'id'})
db.probleme_equipement.belongsTo(db.associations, {foreignKey: 'id_association', sourceKey: 'id'});


db.salles.hasMany(db.documents, {foreignKey: 'id_salle', sourceKey: 'id'})
db.documents.belongsTo(db.salles, {foreignKey: 'id_salle', sourceKey: 'id'});

db.associations.hasMany(db.documents, {foreignKey: 'id_association', sourceKey: 'id'})
db.documents.belongsTo(db.associations, {foreignKey: 'id_association', sourceKey: 'id'})

db.modele_equipement.hasMany(db.documents, {foreignKey: 'id_modele_equipement', sourceKey: 'id'})
db.documents.belongsTo(db.modele_equipement, {foreignKey: 'id_modele_equipement', sourceKey: 'id'})

db.salles.hasMany(db.liaison, {foreignKey: 'id_salle', sourceKey: 'id'});
db.type_usage.hasMany(db.liaison, {foreignKey: 'id_usage', sourceKey: 'id'});

db.liaison.belongsTo(db.salles, {foreignKey: 'id_salle', sourceKey: 'id'});
db.liaison.belongsTo(db.type_usage, {foreignKey: 'id_usage', sourceKey: 'id'})

module.exports = db;
