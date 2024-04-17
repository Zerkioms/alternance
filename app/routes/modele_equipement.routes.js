module.exports = app => {
    const modeleEquipementService = require("../service/ModeleEquipementService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");


    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], modeleEquipementService.insert_modele_equipement);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], modeleEquipementService.fetchModelesEquipements);
    router.get("/type_equipement/:id", [authService.authentication, userService.isAuthorized("readAny")], modeleEquipementService.fetchModelesEquipementsByType);

    router.get("/id/:id", [authService.authentication, userService.isAuthorized("readAny")], modeleEquipementService.find_by_id);
    router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], modeleEquipementService.update_modele_equipement);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], modeleEquipementService.delete_modele_equipement);
    router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], modeleEquipementService.delete_all);

    app.use('/api/ModeleEquipement', router);
};
