const typeUsageRepository = require("../dao/TypeUsageRepository.js");

exports.insertTypeUsage = (req, res, next) => {
    if(!req.body.fonctionnalite) {
        res.status(400).send({
            message: "Content can not be empty!"
        })
        return;
    }
    const type_usage = {
        fonctionnalite: req.body.fonctionnalite
    }
    typeUsageRepository.insertTypeUsage(type_usage).then(function (created) {
        res.status(200).send({
            "Message" : "Le type d'usage a correctement été crée",
            "Type_Usage" : created
        })
        next();
    }).catch(function (err) {
        res.status(400).send({
            "Message" : "Ce type d'usage existe déjà",
            "Error": err
        })
        next(err)
    })
}

exports.findAll = (req, res) => {
    typeUsageRepository.findAll().then(function (type_usage_list) {
        if(type_usage_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les usages a été correctement récupéré",
                "type_usage_list" : type_usage_list
            });
        } else {
            res.status(200).send({
                "Message": "La liste des types d'usage est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des types d'usage",
            "Error": err
        })
    })
}

exports.updateTypeUsage = (req, res, next) => {
    try {
        const id = req.params.id;
        typeUsageRepository.updateTypeUsage(req, id).then(updated => {
            if (updated == 1) {
                console.log(updated)
                res.status(200).send({
                    "Message" : "Le type d'usage a été correctement édité",
                    "updated" : updated
                })
                next();
            }
        }).catch( function(err) {
            res.status(400).send({
                "Message": "Le type d'usage n'a pas été édité",
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

exports.deleteTypeUsage = (req, res, next) => {
    const id = req.params.id;
    typeUsageRepository.deleteTypeUsage(id).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "Le type d'usage a été correctement détruit",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "Le type d'usage n'a pas été détruit",
            "Error": err
        })
        next(err)
    })
}