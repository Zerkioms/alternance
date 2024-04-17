const rechercheRepository = require("../dao/RechercheRepository");

exports.find_all = (req, res, next) => {
    rechercheRepository.find_all(req, res, next).then(function (recherche_list) {
        if (recherche_list != null) {
            res.status(200).send({
                "Message": "La liste de la recherche a été correctement récupéré",
                "recherche_list": recherche_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste de la recherche est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste de la recherche",
            "Error": err
        })
    })
}