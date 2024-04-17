module.exports = app => {
    const associationService = require("../service/AssociationService.js");
    const monitoringService = require("../service/ProjectorMonitoringService.js")
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");


    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], associationService.insert_association);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], associationService.find_all);
    router.get("/id/:id", [authService.authentication, userService.isAuthorized("readAny")], associationService.find_by_id);
    router.get("/:id_salle/associations", [authService.authentication, userService.isAuthorized("readAny")], associationService.fetchAssociationsEquipement);
    router.get("/:id_modele_equipement/equipements", [authService.authentication, userService.isAuthorized("readAny")], associationService.fetchSallebyEquipement);
    router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], associationService.update_association);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], associationService.delete_association);
    router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], associationService.delete_all);

    router.get("/connect", [authService.authentication, userService.isAuthorized("createAny")], monitoringService.connection)
    router.post("/powerProjector", [authService.authentication, userService.isAuthorized("createAny")], monitoringService.powerProjector)

    app.use('/api/Association', router);
};
