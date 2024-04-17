const UsageRepository = require("../dao/UsageRepository.js");

exports.insertUsage = (req, res, next) => {
    if(!req.body.id_usage) {
        res.status(400).send({
            message: "Content can not be empty!"
        })
        return;
    }
    const usage = {
        id_usage: req.body.id_usage,
        id_salle: req.body.id_salle
    }
    UsageRepository.insertUsage(usage).then(function (created) {
        res.status(200).send({
            "Message" : "Le type d'usage a correctement été crée",
            "Usage" : created
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
    UsageRepository.findAll().then(function (usage_list) {
        if(usage_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les usages a été correctement récupéré",
                "usage_list" : usage_list
            });
        } else {
            res.status(200).send({
                "Message": "La liste des usages est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des usages",
            "Error": err
        })
    })
}

exports.findAllBySalle = (req, res, next) => {
    const id_salle = req.params.id_salle;
    UsageRepository.findAllBySalle(req, res, next, id_salle).then(function (usages_list) {
        if(usages_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les usages a été correctement récupéré",
                "usages_list" : usages_list
            });
        } else {
            res.status(200).send({
                "Message": "La liste des usages est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des usages",
            "Error": err
        })
    })
}


exports.deleteUsage = (req, res, next) => {
    const id = req.params.id;
    UsageRepository.deleteUsage(id).then(destroyed => {
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