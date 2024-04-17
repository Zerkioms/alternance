const batimentRepository = require("../dao/BatimentRepository");

exports.insert_batiment = (req, res, next) => {

    const batiment = {
        libelle_long: req.body.libelle_long,
        libelle_court: req.body.libelle_court,
        id_zone: req.body.id_zone
    };

    if (!req.body.libelle_court || !req.body.libelle_long) {
        res.status(400).send({
            message: "Le contenu ne peut être vide!"
        });
        return;
    }

    batimentRepository.insert_batiment(batiment).then(function (batiment) {
        res.status(200).send({
            "Message" : "Le batiment a été correctement crée",
            "Batiment" : batiment
        });
        next();
        
    }).catch(function (err) {
        res.status(400).send({
            "Message" : "Le batiment existe déjà !",
            "Error" : err
        })
        next(err);
    });
}

exports.find_all = (req, res, next) => {
    batimentRepository.find_all(req, res, next).then(function (batiment_list) {
        if(batiment_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les batiments a été correctement récupéré",
                "batiment_list" : batiment_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des batiments est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des batiments",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    const id = req.params.id;
    batimentRepository.find_by_id(req, res, next, id).then(function (batiment) {
        if(batiment == null || batiment == undefined) {
            res.status(400).send({
                "Message": "Le batiment souhaité n'existe pas",
            });
        } else if (batiment.length < 1){
            res.status(400).send({
                "Message": "Aucun batiment n'a été récupéré",
            });
        } else if (batiment.length > 1) {
            res.status(400).send({
                "Message": "Plus d'un batiment a été récupéré",
            });
        } else {
            res.status(200).send({
                "Message" : "Le batiment souhaité a été correctement récupéré",
                "batiment" : batiment
            });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer le batiment souhaité",
            "Error": err
        })
    })
}

exports.update_batiment = (req, res, next) => {
    const id = req.params.id;
    batimentRepository.update_batiment(req, res, next, id).then(updated => {
        if (updated == 1) {
            res.status(200).send({
                "Message" : "Le type d'équipement a été correctement édité",
                "updated" : updated
            })
            next();
        }
        
    }).catch( function(err) {
        res.status(400).send({
            "Message": "Le type d'équipement n'a pas été édité",
            "Error": err
        })
        next(err);
    })
}

exports.delete_batiment = (req, res, next) => {
    const id = req.params.id;
    batimentRepository.delete_batiment(req, res, next, id).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "Le type d'équipement a été correctement détruit",
                "destroyed" : destroyed
            })
            next();
        }
        
    }).catch( function(err) {
        res.status(400).send({
            "Message": "Le type d'équipement n'a pas été détruit",
            "Error": err
        })
        next(err);
    })
}

exports.delete_all = (req, res, next) => {
    batimentRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste de types d'équipement a été correctement détruite",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de types d'équipement n'a pas été détruite",
            "Error": err
        })
        next(err);
    })
}

exports.fetchBatimentsByZone = (req, res, next) => {
    try {
        const id_zone = req.params.id_zone;
        batimentRepository.fetchBatimentsByZone(req, res, next, id_zone).then(function (batiment_list) {
            if(batiment_list != null && batiment_list != undefined) {
                res.status(200).send({
                    "Message" : "La liste de tous les batiments a été correctement récupéré",
                    "batiment_list" : batiment_list
                });
            } else {
                res.status(400).send({
                    "Message": "La liste des batiments est vide",
                })
            }
    
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer la liste des types d'équipement",
                "Error": err
            })
        })
    } catch {
    }

}
