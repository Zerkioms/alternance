module.exports = app => {
    const caracteristiqueService = require("../service/CaracteristiqueService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");



    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], caracteristiqueService.insert_caracteristique);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], caracteristiqueService.find_all);
    router.get("/non_modifiable", [authService.authentication, userService.isAuthorized("readAny")], caracteristiqueService.find_all_non_modifiable);
    router.get("/modifiable", [authService.authentication, userService.isAuthorized("readAny")], caracteristiqueService.find_all_modifiable);
    router.get("/id/:id", [authService.authentication, userService.isAuthorized("readAny")], caracteristiqueService.find_by_id);
    router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], caracteristiqueService.update_caracteristique);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], caracteristiqueService.delete_caracteristique);
    router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], caracteristiqueService.delete_all);

    app.use('/api/Caracteristiques', router);
};

