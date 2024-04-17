const AssociationRepository = require("../dao/AssociationRepository");

exports.insert_association = (req, res, next) => {
    if (!req.body.id_salle && !req.body.id_modele_equipement) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    }
    const association = {
        id_salle: req.body.id_salle,
        id_modele_equipement: req.body.id_modele_equipement,
        status: req.body.status,
        date_archivage: req.body.date_archivage,
        url_administration: req.body.url_administration,
        libelle: req.body.libelle,
        date_installation: req.body.date_installation
    };
    AssociationRepository.insert_association(association).then(function (association) {
        res.status(200).send({
            "Message" : "L'association a été correctement créée",
            "Association" : association
        });
        next();
        
    }).catch(function (err) {
        res.status(400).send({
            message: "Cette association existe déjà !"
        })
        next(err);
    });
}


exports.find_all = (req, res, next) => {
    AssociationRepository.find_all(req, res, next).then(function (association_list) {
        if(association_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les équipements a été correctement récupéré",
                "association_list" : association_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des équipements est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des équipements",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    const id = req.params.id;
    AssociationRepository.find_by_id(req, res, next, id).then(function (association) {
        if(association == null || association == undefined) {
            res.status(400).send({
                "Message": "L'équipement souhaité n'existe pas dans cette salle",
            });
        } else if (association.length < 1){
            res.status(400).send({
                "Message": "Aucun équipement n'a été récupéré dans cette salle",
            });
        } else if (association.length > 1) {
            res.status(400).send({
                "Message": "Plus d'un équipement a été récupéré dans cette salle",
            });
        } else {
            res.status(200).send({
                "Message" : "L'équipement souhaité dans cette salle a été correctement récupéré",
                "Association" : association
            });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer l'équipement souhaité appartenant à cette salle",
            "Error": err
        })
    })
}

exports.update_association = (req, res, next) => {
    const id = req.params.id;
    AssociationRepository.update_association(req, id).then(updated => {
        if (updated == 1) {
            res.status(200).send({
                "Message" : "L'équipement de cette salle a été correctement édité",
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

exports.delete_association = (req, res, next) => {
    const id = req.params.id;
    AssociationRepository.delete_association(req, res, next, id).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "L'équipement de la salle a été correctement détruit",
                "destroyed" : destroyed
            })
            next();
        }
        
    }).catch( function(err) {
        res.status(400).send({
            "Message": "L'équipement de cette salle n'a pas été détruit",
            "Error": err
        })
        next(err);
    })
}

exports.delete_all = (req, res, next) => {
    AssociationRepository.delete_all(req, res, next).then(destroyed => {
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste des équipements de cette salle a été correctement détruite",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de tous les équipements n'a pas été détruite",
            "Error": err
        })
        next(err);
    })
}

exports.fetchAssociationsEquipement = (req, res, next) => {
    const id_salle = req.params.id_salle;
    AssociationRepository.fetchAssociationsEquipement(req, res, next, id_salle).then(function (equipements_list) {
        if(equipements_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les équipements de cette salle a été correctement récupéré",
                "equipements_list" : equipements_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des équipements de cette salle est vide",
                "equipements_list" : equipements_list
            })
        }

    }).catch(function (err) {
        console.log(equipements_list)
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des équipements de cette salle",
            "Error": err
        })
    })
}

exports.fetchSallebyEquipement = (req, res, next) => {
    const id_modele_equipement = req.params.id_modele_equipement;
    AssociationRepository.fetchSallebyEquipement(req, res, next, id_modele_equipement).then(function (salles_list) {
        if(salles_list != null) {
            res.status(200).send({
                "Message" : "La liste des salle de cet equipement a été correctement récupéré",
                "salles_list" : salles_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des salle de cet equipement est vide",
                "salles_list" : salles_list
            })
        }

    }).catch(function (err) {
        console.log(equipements_list)
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des salle de cet equipement",
            "Error": err
        })
    })
}