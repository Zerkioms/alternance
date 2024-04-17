const db = require("../models");


const Zone = db.zones;
const Batiment = db.batiments;
const Salle = db.salles;
const Type_Salle = db.type_salle;
const ModeleEquipement = db.modele_equipement;
const TypeEquipement = db.type_equipement;
const Caracteristique = db.caracteristiques;
const Commentaire = db.commentaires_etats;
const DataModele = db.data_modele;

const Op = db.Sequelize.Op;


var XLSX = require('xlsx');

exports.readXLS = () => {

    var workbook = XLSX.readFile('app/script/base_linx.xlsx');
    var sheet_name_list = workbook.SheetNames;
    
    var i = 0;
    var data_feuille_base = null;
    var data_feuille_matos = null;
    var data_feuille_resolution = null;
    
    
    sheet_name_list.forEach(function(y) {
        i = i+1;
        var worksheet = workbook.Sheets[y];
        var headers = {};
        var data = [];
        for(z in worksheet) {
            if(z[0] === '!') continue;
            //parse out the column, row, and value
            var col = z.substring(0,1);
            var row = parseInt(z.substring(1));
            var value = worksheet[z].v;
    
            //store header names
            if(row == 1) {
                headers[col] = value;
                continue;
            }
    
            if(!data[row]) data[row]={};
            data[row][headers[col]] = value;
        }
        //drop those first two rows which are empty
        data.shift();
        data.shift();
        console.log(data);
        if(i == 1){
            data_feuille_base = data;
        } else if (i == 2){
            data_feuille_matos = data;
        } else {
            data_feuille_resolution = data;
        }
    });
    
    
    
    const formatted_base_json = JSON.stringify(data_feuille_base);
    const parsed_base = JSON.parse(formatted_base_json);
    
    const formatted_matos_json = JSON.stringify(data_feuille_matos);
    const parsed_matos = JSON.parse(formatted_matos_json);
    
    var fill_base = new add_data_on_base();
    var fill_matos = new add_data_matos();
    
    
     function add_data_on_base(){    
            parsed_base.forEach((obj) => {
                var cle_etrangere_type_salle = null;
    
                Type_Salle.findOrCreate({
                    where: {designation: obj.designation},
                    defaults:{
                        designation: obj.designation,
                    }
                }).then(([type_salle, created]) => {
                    cle_etrangere_type_salle = type_salle;
                });
    
                Zone.findOrCreate({
                    where: {libelle_court: obj.Zone},
                    defaults: {
                        libelle_court: obj.Zone,
                    }
                }).then(result => Batiment.findOrCreate({
                    where: {libelle_court: obj.code_bat},
                    defaults:{
                        libelle_court: obj.code_bat,
                        id_zone: result[0].id,
                    }
                }).then(result => Salle.findOrCreate({
                    where: {libelle: obj.piece},
                    defaults: {
                        libelle: obj.piece,
                        etage: obj.etage,
                        id_batiment: result[0].id,
                        id_type_salle: cle_etrangere_type_salle.id
                    }
                })
                ));
    
    
    
    
    
            });
    }
    
    function add_data_matos() {
            parsed_matos.forEach((obj) => {
    
                var cle_etrangere_caracteristiques = null;
                var cle_etrangere_data_equipement = null;
                var cle_etrangere_modele_equipement = null;
                var cle_etrangere_commentaire = null;
                var cle_etrangere_salle = null;
    
                Caracteristique.findOrCreate({
                    where:{grandeur: obj.cle},
                    defaults:{
                        grandeur:obj.cle,
                    }
                }).then(([caracteristiques, created]) => {
                    cle_etrangere_caracteristiques = caracteristiques;
                })
    
                TypeEquipement.findOrCreate({
                    where:{nom: obj.Type},
                    defaults:{
                        nom: obj.Type,
                    }
                }).then(result => ModeleEquipement.findOrCreate({
                        where:{modele: obj.Modele},
                        defaults:{
                            marque: obj.Marque,
                            modele: obj.Modèle,
                            id_type_equipement: result[0].id
                        }
                    }).then(result =>
                    DataModele.findOrCreate({
                        where:{valeur: JSON.stringify(obj.Valeur), id_caracteristiques: cle_etrangere_caracteristiques.id, id_modele_equipement: cle_etrangere_modele_equipement},
                        defaults:{
                            valeur: obj.Valeur,
                            id_modele_equipement: JSON.stringify(result[0].id),
                            id_caracteristiques: cle_etrangere_caracteristiques.id
                        }
                    }))
                )
    
    
                });
        }
    
}
