const DataModeleRepository = require("../dao/DataModeleRepository");

exports.insert_data_modele = (req, res, next) => {
    try {
        if (!req.body.id_caracteristiques && !req.body.id_modele_equipement) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
            return;
        }
        const data_modele = {
            //valeur: req.body.valeur,
            id_caracteristiques: req.body.id_caracteristiques,
            id_modele_equipement: req.body.id_modele_equipement,
        };
        DataModeleRepository.insert_data_modele(data_modele).then(function (created_data_modele) {
            try {
                if(created_data_modele != null) {
                    res.status(200).send({
                        "Message" : "La données de modèles a été correctement créé",
                        "created_data_modele" : created_data_modele
                    });
                    next()
                    
                }
            } catch (err) {
                res.status(400).send({
                    "Message": "La données de modèles n'a pas été créé",
                    "Error": err
                })
                next(err)
            }
        })
    } catch (err) {
        res.status(400).send({
            "Message": "La données de modèles n'a pas été créé",
            "Error": err
        })
        next(err)
    }
  
}

exports.find_all = (req, res, next) => {
    DataModeleRepository.find_all(req, res, next).then(function (data_model_list) {
        if(data_model_list != null) {
            res.status(200).send({
                "Message" : "La liste de toutes les données de modèles a été correctement récupéré",
                "data_model_list" : data_model_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des données de modèles est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des données de modèles",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    try {
        const id = req.params.id;
        DataModeleRepository.find_by_id(req, res, next, id).then(function (data_model) {
            if(data_model == null || data_model == undefined) {
                res.status(400).send({
                    "Message": "La données de modèles souhaité n'existe pas",
                });
            } else if (data_model.length < 1){
                res.status(400).send({
                    "Message": "Aucune données de modèles n'a été récupéré",
                });
            } else if (data_model.length > 1) {
                res.status(400).send({
                    "Message": "Plus d'une données de modèles a été récupéré",
                });
            } else {
                res.status(200).send({
                    "Message" : "La données de modèles souhaitée a été correctement récupéré",
                    "data_model" : data_model
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer le données de modèles souhaité",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.update_data_modele = (req, res, next) => {
    try {
        const id = req.params.id;
        DataModeleRepository.update_data_modele(req, res, next, id).then(updated => {
            if (updated == 1) {
                res.status(200).send({
                    "Message" : "La données de modèles a été correctement édité",
                    "updated" : updated
                })
                next()
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La données de modèles n'a pas été édité",
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

exports.delete_data_modele = (req, res, next) => {
    try {
        const id = req.params.id;
        DataModeleRepository.delete_data_modele(req, res, next, id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "La données de modèles a été correctement détruit",
                    "destroyed" : destroyed
                })
                next()
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La données de modèles n'a pas été détruit",
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
    DataModeleRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste de données de modèles a été correctement détruite",
                "destroyed" : destroyed
            })
            next()
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de données de modèles n'a pas été détruite",
            "Error": err
        })
        next(err)
    })
}

exports.deleteCaracteristiquesByModele = (req, res, next) => {
    try {
        if(req.params.id) {
            const id_modele = req.params.id;
            DataModeleRepository.deleteCaracteristiquesByModele(req, res, next, id_modele).then(destroyed => {
                if(destroyed >= 0) {
                    res.status(200).send({
                        "Message" : "La liste de données de modèles a été correctement détruite",
                        "destroyed" : destroyed
                    })
                    next()
                }
            }).catch( function(err) {
                res.status(400).send({
                    "Message": "La liste de données de modèles n'a pas été détruite",
                    "Error": err
                })
                next(err)
            })
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.fetchCaracteristiquesModele = (req, res, next) => {
    try {
        if(req.params.id) {
            const id_modele = req.params.id;
            DataModeleRepository.fetchCaracteristiquesModele(req, res, next, id_modele).then(modele => {
                if(modele == null || modele == undefined) {
                    res.status(400).send({
                        "Message": "La données de modèles souhaité n'existe pas",
                    });
                } else if (modele.length < 1){
                    res.status(400).send({
                        "Message": "Aucune données de modèles n'a été récupéré",
                    });
                } else {
                    res.status(200).send({
                        "Message" : "La données de modèles souhaitée a été correctement récupéré",
                        "modele" : modele
                    });
                }
            })
        }

    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}
