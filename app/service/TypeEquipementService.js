const typeEquipementRepository = require("../dao/TypeEquipementRepository");

exports.insert_type_equipement = (req, res, next) => {
    if (!req.body.nom) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const type_equipement = {
        nom: req.body.nom,
        icon: req.body.icon
    };
    typeEquipementRepository.insert_type_equipement(type_equipement).then(function (created) {
        res.status(200).send({
            "Message" : "Le type d'équipement a été correctement crée",
            "Type_Equipement" : created
        });
        next();
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Ce type d'équipement existe déjà !",
            "Error": err
        })
        next(err)
    });
}

exports.find_all = (req, res) => {
    typeEquipementRepository.find_all().then(function (type_equipement_list) {
        if(type_equipement_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les équipements a été correctement récupéré",
                "type_equipement_list" : type_equipement_list
            });
        } else {
            res.status(200).send({
                "Message": "La liste des types d'équipement est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des types d'équipement",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res) => {
    const id = req.params.id;
    typeEquipementRepository.find_by_id(id).then(function (type_equipement) {
        if(type_equipement == null || type_equipement == undefined) {
            res.status(400).send({
                "Message": "Le type d'équipement souhaité n'existe pas",
            });
        } else if (type_equipement.length < 1){
            res.status(400).send({
                "Message": "Aucun type d'équipement n'a été récupéré",
            });
        } else if (type_equipement.length > 1) {
            res.status(400).send({
                "Message": "Plus d'un type d'équipement a été récupéré",
            });
        } else {
            res.status(200).send({
                "Message" : "Le type d'équipement souhaité a été correctement récupéré",
                "type_equipement" : type_equipement
            });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer le type d'équipement souhaité",
            "Error": err
        })
    })
}

exports.update_type_equipement = (req, res, next) => {
    try {
        const id = req.params.id;
        typeEquipementRepository.update_type_equipement(req, id).then(updated => {
            if (updated == 1) {
                console.log(updated)
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
            next(err)
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }
}

exports.delete_type_equipement = (req, res, next) => {
    const id = req.params.id;
    typeEquipementRepository.delete_type_equipement(id).then(destroyed => {
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
        next(err)
    })
}

exports.delete_all = (req, res, next) => {
    typeEquipementRepository.delete_all().then(destroyed => {
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
        next(err)
    })
}