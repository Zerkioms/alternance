const salleRepository = require("../dao/SalleRepository");

exports.insert_salle = (req, res, next) => {
    if (!req.body.libelle) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const salle = {
        libelle: req.body.libelle,
        id_type_salle: req.body.id_type_salle,
        etage: req.body.etage,
        id_batiment: req.body.id_batiment
    };



    salleRepository.insert_salle(salle).then(created => {
        res.status(200).send({
            "Message": "La salle a été correctement crée",
            "Salle": created
        });
        next();
    }).catch(err => {
        res.status(400).send({
            "Message": "La salle existe déjà !",
            "Error": err
        })
        next(err);
    }
    );
}

exports.find_all = (req, res, next) => {
    salleRepository.find_all(req, res, next).then(function (salle_list) {
        if(salle_list != null) {
            res.status(200).send({
                "Message" : "La liste de toutes les salles a été correctement récupéré",
                "salle_list" : salle_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des salles est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des salles",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    try {
        const id = req.params.id;
        salleRepository.find_by_id(req, res, next, id).then(function (salle) {
            if(salle == null || salle == undefined) {
                res.status(400).send({
                    "Message": "La salle souhaité n'existe pas",
                });
            } else if (salle.length < 1){
                res.status(400).send({
                    "Message": "Aucune salle n'a été récupéré",
                });
            } else if (salle.length > 1) {
                res.status(400).send({
                    "Message": "Plus d'une salle a été récupéré",
                });
            } else {
                res.status(200).send({
                    "Message" : "La salle souhaitée a été correctement récupéré",
                    "salle" : salle
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer la salle souhaité",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.update_salle = (req, res, next) => {
    try {
        const id = req.params.id;
        salleRepository.update_salle(req, res, next, id).then(updated => {
            if (updated == 1) {
                res.status(200).send({
                    "Message" : "La salle a été correctement édité",
                    "updated" : updated
                })
                next();
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La salle n'a pas été édité",
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

exports.delete_salle = (req, res, next) => {
    try {
        const id = req.params.id;
        salleRepository.delete_salle(req, res, next, id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "La salle a été correctement détruit",
                    "destroyed" : destroyed
                })
                next();
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La salle n'a pas été détruit",
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
    salleRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste des salles a été correctement détruite",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste des salles n'a pas été détruite",
            "Error": err
        })
        next(err);
    })
}

exports.fetchSallesByBatiment = (req, res, next) => {
    try {
        const id_batiment = req.params.id_batiment;
        salleRepository.fetchSallesByBatiment(req, res, next, id_batiment).then(function (salle_list) {
            if(salle_list != null && salle_list != undefined) {
                res.status(200).send({
                    "Message" : "La liste de toutes les salles a été correctement récupéré",
                    "salle_list" : salle_list
                });
            } else {
                res.status(400).send({
                    "Message": "La liste des salles est vide",
                })
            }
    
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer la liste des salles",
                "Error": err
            })
        })
    } catch {
        res.status(500).json({
            error: new Error('Invalid request!')
          });
    }

}
