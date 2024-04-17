const TypeSalleRepository = require("../dao/TypeSalleRepository");

exports.insert_type_salle = (req, res, next) => {
    if (!req.body.designation) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const type_salle = {
        designation: req.body.designation,
    };
    TypeSalleRepository.insert_type_salle(type_salle).then(function (type_salle) {
        res.status(200).send({
            "Message" : "Le type de salle a été correctement crée",
            "Type de salle" : type_salle
        });
        next();
    }).catch(function (err) {
        res.status(400).send({
            message: "Ce type de salle existe déjà !"
        })
        next(err);
    });
}

exports.find_all = (req, res, next) => {
    TypeSalleRepository.find_all(req, res, next).then(function (type_salle_list) {
        if(type_salle_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les types de salle a été correctement récupéré",
                "type_salle_list" : type_salle_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des types de salle est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des types de salle",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    try {
        const id = req.params.id;
        TypeSalleRepository.find_by_id(req, res, next, id).then(function (type_salle) {
            if(type_salle == null || type_salle == undefined) {
                res.status(400).send({
                    "Message": "Le type de salle souhaité n'existe pas",
                });
            } else if (type_salle.length < 1){
                res.status(400).send({
                    "Message": "Aucun type de salle n'a été récupéré",
                });
            } else if (type_salle.length > 1) {
                res.status(400).send({
                    "Message": "Plus d'un type de salle a été récupéré",
                });
            } else {
                res.status(200).send({
                    "Message" : "Le type de salle souhaitée a été correctement récupéré",
                    "type_salle" : type_salle
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer le type de salle souhaité",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.update_type_salle = (req, res, next) => {
    try {
        const id = req.params.id;
        TypeSalleRepository.update_type_salle(req, res, next, id).then(updated => {
            if (updated == 1) {
                res.status(200).send({
                    "Message" : "Le type de salle a été correctement édité",
                    "updated" : updated
                })
                next();
            }
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La zone n'a pas été édité",
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

exports.delete_type_salle = (req, res, next) => {
    try {
        const id = req.params.id;
        TypeSalleRepository.delete_type_salle(req, res, next, id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "Le type de salle a été correctement détruit",
                    "destroyed" : destroyed
                })
                next();
            }
    
        }).catch( function(err) {
            res.status(400).send({
                "Message": "Le type de salle n'a pas été détruit",
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
    TypeSalleRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste de types de salle a été correctement détruite",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de types de salle n'a pas été détruite",
            "Error": err
        })
        next(err);
    })
}

exports.find_by_designation = (req, res, next) => {
    const designation = req.body.designation;
    TypeSalleRepository.find_by_designation(req, res, next, designation);
}