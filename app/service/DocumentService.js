const DocumentRepository = require("../dao/DocumentRepository");


exports.insertDocument = (req, res, next) => {


    const document = {
        nom: req.body.nom,
        hash: req.body.hash,
        type_document: req.body.type_document,
        id_salle: req.body.id_salle,
        id_modele_equipement: req.body.id_modele,
        id_association: req.body.id_association
    };

    if(req.body.nom == "" || req.body.hash == "") {
        res.status(400).send({
            message:"Les informations ne peuvent pas être vide !"
        })
        return;
    }
        DocumentRepository.insertDocument(document).then(function (document) {
            res.status(200).send({
                "Message" : "le document a été correctement encodé et ajouté à la base de données",
                "Document" : document
            });
            next();
            
        }).catch(function (err) {
            console.log(err);
            res.status(400).send({
                message: "Erreur 400, vérifiez le code en backend pour la corriger !",
                "Error" : err
            })
            next(err);
        });

}

exports.deleteDocument = (req, res, next) => {
    try {
        const id = req.params.id;
        DocumentRepository.deleteDocument(id).then(destroyed => {
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "Le document a été correctement détruit",
                    "destroyed" : destroyed
                })
                next();
            }
            
        }).catch( function(err) {
            res.status(400).send({
                "Message": "Le document n'a pas été détruit",
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

exports.findBySalle = (req, res) => {
    try {
        const id = req.params.id;
        DocumentRepository.findBySalle(id).then(documents => {
            if(documents == null) {
                res.status(400).send({
                    "Message": "Aucun document n'a été trouvé"
                })
            } else {
                res.status(200).send({
                    "Message" : "Les documents ont été correctement récupérés",
                    "Documents" : documents
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer les documents souhaités",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }
}

exports.findByModele = (req, res) => {
    try {
        const id = req.params.id_modele;
        DocumentRepository.findByModele(id).then(documents => {
            if(documents == null) {
                res.status(400).send({
                    "Message": "Aucun document n'a été trouvé"
                })
            } else {
                res.status(200).send({
                    "Message" : "Les documents ont été correctement récupérés",
                    "Documents" : documents
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer les documents souhaités",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }
}

exports.findByAssociation = (req, res) => {
    try {
        const id = req.params.id_association;
        DocumentRepository.findByAssociation(id).then(documents => {
            if(documents == null) {
                res.status(400).send({
                    "Message": "Aucun document n'a été trouvé"
                })
            } else {
                res.status(200).send({
                    "Message" : "Les documents ont été correctement récupérés",
                    "Documents" : documents
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer les documents souhaités",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }
}