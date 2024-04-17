const zoneRepository = require("../dao/ZoneRepository");

exports.insert_zone = (req, res, next) => {
    if (req.body.libelle_court == "" || req.body.libelle_long == "") {
        res.status(400).send({
            message: "Le libelle ne peut pas être vide !"
        });
    } else {
        const zone = {
            libelle_long: req.body.libelle_long,
            libelle_court: req.body.libelle_court,
        };
        zoneRepository.insert_zone(zone).then(function (zone) {
            res.locals.body = JSON.stringify(zone);
            res.status(200).send({
                "Message": "la zone a été correctement créée",
                "Zone": zone,
            });
            next();
        }).catch(function (err) {
            res.status(400).send({
                message: "La zone existe déjà !"
            });
            next(err); // appel de next() en cas d'erreur
        });
    }
};

exports.find_all = (req, res, next) => {
    zoneRepository.find_all(req, res, next).then(function (zone_list) {
        res.locals.body = JSON.stringify(zone_list);

        if(zone_list != null) {
            res.status(200).send({
                "Message" : "La liste de toutes les zones a été correctement récupéré",
                "zone_list" : zone_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des zone est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des zones",
            "Error": err
        })
    })
}

exports.find_by_id = (req, res, next) => {
    try {
        const id = req.params.id_zone;
        zoneRepository.find_by_id(id).then(function (zone) {
            res.locals.body = JSON.stringify(zone);
            if(zone == null || zone == undefined) {
                res.status(400).send({
                    "Message": "La zone souhaité n'existe pas",
                });
            } else if (zone.length < 1){
                res.status(400).send({
                    "Message": "Aucune zone n'a été récupéré",
                });
            } else if (zone.length > 1) {
                res.status(400).send({
                    "Message": "Plus d'une zone a été récupéré",
                });
            } else {
                res.status(200).send({
                    "Message" : "La zone souhaitée a été correctement récupéré",
                    "zone" : zone
                });
            }
        }).catch(function (err) {
            res.status(400).send({
                "Message": "Impossible de récupérer la zone souhaité",
                "Error": err
            })
        })
    } catch {
        res.status(401).json({
            error: new Error('Invalid request!')
          });
    }

}

exports.update_zone = (req, res, next) => {
        const id = req.params.id_zone;
        zoneRepository.update_zone(req, res, next, id).then(updated => {
          //  res.locals.body = updated;
            if (updated == 1) {
                console.log(updated)
                res.status(200).send({
                    "Message" : "La zone a été correctement édité",
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
}

exports.delete_zone = (req, res, next) => {
        const id = req.params.id;
        zoneRepository.delete_zone(id).then(destroyed => {
            res.locals.body = destroyed;
            if(destroyed == 1) {
                res.status(200).send({
                    "Message" : "La zone a été correctement détruite",
                    "destroyed" : destroyed
                })
                next();
            }    
        }).catch( function(err) {
            res.status(400).send({
                "Message": "La zone n'a pas été détruite",
                "Error": err
            })
            next(err);
        })
}

exports.delete_all = (req, res, next) => {
    zoneRepository.delete_all(req, res, next).then(destroyed => {
        res.locals.body = destroyed;
        if(destroyed == 1) {
            res.status(200).send({
                "Message" : "La liste de toutes les zones a été correctement détruite",
                "destroyed" : destroyed
            })
            next();
        }
    }).catch( function(err) {
        res.status(400).send({
            "Message": "La liste de toutes les zones n'a pas été détruite",
            "Error": err
        })
        next(err);
    })
}
