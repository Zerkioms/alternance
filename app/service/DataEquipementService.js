const DataEquipementRepository = require("../dao/DataEquipementRepository");

exports.insert_data_equipement = (req, res, next) => {
    if (!req.body.id_association) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const data_equipement = {
        valeur: req.body.valeur_caracteristiques,
        id_caracteristiques: req.body.id_caracteristiques,
        id_association: req.body.id_association,
        id_salle: req.body.id_salle
    };
    DataEquipementRepository.insert_data_equipement(data_equipement).then(function (caracteristiques) {
        res.status(200).send({
            "Message" : "Les caractéristiques ont bien été ajoutées à l'équipement",
            "data_equipement" : caracteristiques
        });
        next()
        
    }).catch(function (err) {
        res.status(400).send({
            message: "Ces caractéristiques sont déjà présentes !"
        })
        next(err)
    });
}

exports.find_all = (req, res, next) => {
    DataEquipementRepository.find_all(req, res, next).then(function (data_equipement_list) {
        if(data_equipement_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les types de salle a été correctement récupéré",
                "data_equipement_list" : data_equipement_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des données d'équipement est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des données d'équipement",
            "Error": err
        })
    })
}
exports.find_caracteristiques_by_equipement = (req, res, next) => {
    try {
        const id = req.params.id;
        DataEquipementRepository.find_caracteristiques_by_equipement(req, res, next, id)
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.find_by_id = (req, res, next) => {
    try {
        const id = req.params.id;
        DataEquipementRepository.find_by_id(req, res, next, id).then(function (data_equipement) {
            if(data_equipement == null || data_equipement == undefined) {
                res.status(400).send({
                    "Message": "La données d'équipement souhaité n'existe pas",
                });
            } else if (data_equipement.length < 1){
                res.status(400).send({
                    "Message": "Aucune données d'équipement n'a été récupéré",
                });
            } else if (data_equipement.length > 1) {
                res.status(400).send({
                    "Message": "Plus d'une données d'équipement a été récupéré",
                });
            } else {
                res.status(200).send({
                    "Message" : "La données d'équipement souhaitée a été correctement récupéré",
                    "data_equipement" : data_equipement
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer la données d'équipement souhaité",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.update_data_equipement = (req, res, next) => {
    try {
        const id = req.params.id;
        DataEquipementRepository.update_data_equipement(req, res, next, id).then(updated => {
            if (updated == 1) {
                res.status(200).send({
                    "Message" : "La données d'équipement a été correctement édité",
                    "updated" : updated
                })
                next()
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La données d'équipement n'a pas été édité",
                "Error": err
            })
            next(err)
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.delete_data_equipement = (req, res, next) => {
    try {
        const id = req.params.id;
        DataEquipementRepository.delete_data_equipement(req, res, next, id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "La données d'équipement a été correctement détruit",
                    "destroyed" : destroyed
                })
                next()
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La données d'équipement n'a pas été détruit",
                "Error": err
            })
            next(err)
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.delete_all = (req, res, next) => {
    DataEquipementRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste de données d'équipement a été correctement détruite",
                "destroyed" : destroyed
            })
            next()
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de données d'équipement n'a pas été détruite",
            "Error": err
        })
        next(err)
    })
}

exports.delete_data_equipement_by_association = (req, res, next) => {
    try {
        const id_association = req.params.id_association;
        DataEquipementRepository.delete_data_equipement_by_association(req, res, next, id_association).then(destroyed => {
            if(destroyed != null) {
                res.status(200).send({
                    "Message" : "La liste de données d'équipement a été correctement détruite",
                    "destroyed" : destroyed
                })
                next()
            }
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La liste de données d'équipement n'a pas été détruite",
                "Error": err
            })
            next(err)
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}