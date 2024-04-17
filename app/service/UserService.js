const AccessControl = require('accesscontrol');
const UserRepository = require('../dao/UserRepository');

const grantList = require('../config/grantList');
const ac = new AccessControl(grantList);

exports.isAuthorized = (action) => {
    return async (req, res, next) => {
        try{
            UserRepository.find_by_uid(req.headers.user).then(user => {
                try{
                    let ressource = req.baseUrl.substring(req.baseUrl.lastIndexOf('/') + 1);
                    if(ac.can(user.role.role)[action](ressource).granted == true){
                        next();
                    } 
                } catch {
                    res.status(400).json({
                        error : new Error("Permission denied ! Role hierarchically too low.")
                    })
                }
                }
            )
        } catch {
            res.status(401).json({
                error: new Error('Invalid request!')
              });    }
    }

}

exports.isAdmin = (req, res) => {
    try{
        UserRepository.find_by_uid(req, res).then(user => { 
            if(user.role.role != 'admin' || user.role.role != 'superadmin'){
                return false
            } else {
                return true
                }
            }
        )
    } catch {
        console.error();
    }
}

exports.find_all = (req, res, next) => {
    UserRepository.find_all(req, res, next).then(function (user_list) {
        if(user_list != null) {
            res.status(200).send({
                "Message" : "La liste de tous les utilisateurs a été correctement récupéré",
                "user_list" : user_list
            });
        } else {
            res.status(400).send({
                "Message": "La liste des utilisateurs est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des utilisateurs",
            "Error": err
        })
    })
}

exports.find_by_uid = (req, res, next) => {
    try {
        let user = {
            uid: req.params.uid
        }
        user.uid = req.params.uid;
        UserRepository.find_by_uid(user).then(function (user) {
            if(user == null || user == undefined) {
                res.status(400).send({
                    "Message": "L'utilisateur souhaité n'existe pas",
                });
            } else {
                res.status(200).send({
                    "Message" : "L'utilisateur souhaité a été correctement récupéré",
                    "user" : user
                });
            }
        })
    } catch {
        res.status(400).send({
            "Message": "Impossible de récupérer l'utilisateur souhaité",
            "Error": "Je suis une erreur"
        })
    }
}

exports.findRoles = (req, res, next) => {
    UserRepository.findRoles(req, res, next).then(function (roles) {
        if(roles != null) {
            res.status(200).send({
                "Message" : "La liste de tous les rôles a été correctement récupéré",
                "roles" : roles
            });
        } else {
            res.status(400).send({
                "Message": "La liste des rôles est vide",
            })
        }

    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer la liste des rôles",
            "Error": err
        })
    })
}

exports.updateRole = (req, res, next) => {
    try {
        let user = {
            id: req.params.id,
            role: req.body.role
        }
        UserRepository.updateRole(user).then(function (user) {
            if(user == null || user == undefined) {
                res.status(400).send({
                    "Message": "L'utilisateur souhaité n'existe pas",
                });
            } else {
                res.status(200).send({
                    "Message" : "Le rôle de l'utilisateur a été correctement modifié",
                    "user" : user
                });
            }
        })
    } catch {
        res.status(400).send({
            "Message": "Impossible de modifier le rôle de l'utilisateur",
            "Error": "Je suis une erreur"
        })
    }
}