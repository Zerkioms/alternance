const caracteristiqueRepository = require("../dao/CaracteristiquesRepository");

exports.insert_caracteristique = (req, res, next) => {
    if (!req.body.grandeur) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const caracteristique = {
        grandeur: req.body.grandeur,
        type_valeur: req.body.type_valeur,
        unite: req.body.unite,
        valeur_default: req.body.valeur_default,
        groupement: req.body.groupement,
        modifiable: req.body.modifiable,
    };
    caracteristiqueRepository.insert_caracteristique(caracteristique).then(function (caracteristique) {
        res.status(200).send({
            "Message" : "La caractéristique a été correctement crée",
            "caracteristique" : caracteristique
        });
        next()
        
    }).catch(function (err) {
        res.status(400).send({
            message: "La grandeur de cette caractéristique existe déjà !"
        })
        next(err)
    });
}

exports.find_all = (req, res, next) => {
    caracteristiqueRepository.find_all(req, res, next).then(function (caracteristique_list) {
        if(caracteristique_list != null) {
            res.status(200).send({
                "Message" : "La liste de toutes les caractéristiques a été correctement récupéré",
                "caracteristique_list" : caracteristique_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des caractéristiques est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des caractéristiques",
            "Error": err
        })
    })
}
exports.find_all_non_modifiable = (req, res, next) => {
    caracteristiqueRepository.find_all_non_modifiable(req, res, next).then(function (caracteristique_non_modifiable_list) {
        if (caracteristique_non_modifiable_list.length!= null){
            res.status(200).send({
                "Message" : "La liste de toutes les caractéristiques non modifiable a été correctement récupéré",
                "caracteristique_non_modifiable_list" : caracteristique_non_modifiable_list
                        });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des caractéristiques non modifiable",
            "Error": err
        })
    })
}

exports.find_all_modifiable = (req, res, next) => {
    caracteristiqueRepository.find_all_modifiable(req, res, next).then(function (caracteristique_modifiable_list) {
        if (caracteristique_modifiable_list.length!= null){
            res.status(200).send({
                "Message" : "La liste de toutes les caractéristiques modifiables a été correctement récupéré",
                "caracteristique_modifiable_list" : caracteristique_modifiable_list
                        });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des caractéristiques modifiables",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    const id = req.params.id;
    caracteristiqueRepository.find_by_id(req, res, next, id).then(function (caracteristique) {
        if(caracteristique == null || caracteristique == undefined) {
            res.status(400).send({
                "Message": "La caracteristique souhaité n'existe pas",
            });
        } else if (caracteristique.length < 1){
            res.status(400).send({
                "Message": "Aucune caracteristique n'a été récupéré",
            });
        } else if (caracteristique.length > 1) {
            res.status(400).send({
                "Message": "Plus d'une caracteristique a été récupéré",
            });
        } else {
            res.status(200).send({
                "Message" : "Le caracteristique souhaité a été correctement récupéré",
                "caracteristique" : caracteristique
            });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la caracteristique souhaité",
            "Error": err
        })
    })
}

exports.update_caracteristique = (req, res, next) => {
    try {
        const id = req.params.id;
        caracteristiqueRepository.update_caracteristique(req, res, next, id).then(updated => {
            if (updated == 1) {
                res.status(200).send({
                    "Message" : "La caracteristique a été correctement édité",
                    "updated" : updated
                })
                next()
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La caracteristique n'a pas été édité",
                "Error": err
            })
            next(err)
        })
    } catch {

    }

}

exports.delete_caracteristique = (req, res, next) => {
    try {
        const id = req.params.id;
        caracteristiqueRepository.delete_caracteristique(req, res, next, id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "La caracteristique a été correctement détruit",
                    "destroyed" : destroyed
                })
                next()
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La caracteristique n'a pas été détruit",
                "Error": err
            })
            next(err)
        })
    } catch {

    }

}

exports.delete_all = (req, res, next) => {
    caracteristiqueRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste des caracteristique a été correctement détruite",
                "destroyed" : destroyed
            })
            next()
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste des caracteristique n'a pas été détruite",
            "Error": err
        })
        next(err)
    })
}
