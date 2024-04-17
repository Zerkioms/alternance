const ModeleEquipementRepository = require("../dao/ModeleEquipementRepository");

exports.insert_modele_equipement = (req, res, next) => {
    if (!req.body.modele) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const modele_equipement = {
        marque: req.body.marque,
        modele: req.body.modele,
        dispo_vente: req.body.dispo_vente,
        id_type_equipement: req.body.id_type_equipement,
    };
    ModeleEquipementRepository.insert_modele_equipement(modele_equipement).then(function (modele_equipement) {
        res.status(200).send({
            "Message" : "Le modèle d'équipement a été correctement crée",
            "Modele_equipement" : modele_equipement
        });
        next();
    }).catch(function (err) {
        res.status(400).send({
            message: "Ce modèle d'équipement existe déjà !"
        })
        next(err)
    });
}

exports.find_all = (req, res, next) => {
    ModeleEquipementRepository.find_all(req, res, next).then(function (modele_equipement_list) {
        if(modele_equipement_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les modèles d'équipement a été correctement récupéré",
                "modele_equipement_list" : modele_equipement_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des modèles d'équipement est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des modèles d'équipement",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    try {
        const id = req.params.id;
        ModeleEquipementRepository.find_by_id(req, res, next, id).then(function (modele_equipement) {
            if(modele_equipement == null || modele_equipement == undefined) {
                res.status(400).send({
                    "Message": "Le modèle d'équipement souhaité n'existe pas",
                });
            } else if (modele_equipement.length < 1){
                res.status(400).send({
                    "Message": "Aucun modèle d'équipement n'a été récupéré",
                });
            } else if (modele_equipement.length > 1) {
                res.status(400).send({
                    "Message": "Plus d'un modèle d'équipement a été récupéré",
                });
            } else {
                res.status(200).send({
                    "Message" : "Le modèles d'équipement souhaitée a été correctement récupéré",
                    "modele_equipement" : modele_equipement
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer le modèle d'équipement souhaité",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.update_modele_equipement = (req, res, next) => {
    try {
        const id = req.params.id;
        ModeleEquipementRepository.update_modele_equipement(req, res, next, id).then(updated => {
            if (updated == 1) {
                res.status(200).send({
                    "Message" : "Le modèle d'équipement a été correctement édité",
                    "updated" : updated
                })
                next();
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "Le modèle d'équipement n'a pas été édité",
                "Error": err
            })
            next(err);
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.delete_modele_equipement = (req, res, next) => {
    try {
        const id = req.params.id;
        ModeleEquipementRepository.delete_modele_equipement(req, res, next, id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "Le modèle d'équipement a été correctement détruit",
                    "destroyed" : destroyed
                })
                next();
            }
        }).catch( function(err) {
            res.status(400).send({
                "Message": "Le modèle d'équipement n'a pas été détruit",
                "Error": err
            })
            next(err);
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.delete_all = (req, res, next) => {
    ModeleEquipementRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste de modèles d'équipement a été correctement détruite",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de modèles d'équipement n'a pas été détruite",
            "Error": err
        })
        next(err);
    })
}

exports.fetchModelesEquipements = (req, res, next) => {
    try{
    ModeleEquipementRepository.fetchModelesEquipements(req, res, next).then(function (modeles_list) {
        if(modeles_list != null && modeles_list != undefined) {
            res.status(200).send({
                "Message" : "La liste de tous les modèles a été correctement récupéré",
                "modeles_list" : modeles_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des modèles est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des modèles",
            "Error": err
        })
    })
} catch {
}
}

exports.fetchModelesEquipementsByType = (req, res, next) => {
    try{
        let id_type_equipement = req.params.id
    ModeleEquipementRepository.fetchModelesEquipementsByType(id_type_equipement).then(function (modeles_list) {
        if(modeles_list != null && modeles_list != undefined) {
            res.status(200).send({
                "Message" : "La liste de tous les modèles a été correctement récupéré",
                "modeles_list" : modeles_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des modèles est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des modèles",
            "Error": err
        })
    })
} catch {
}
}