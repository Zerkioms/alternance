module.exports = app => {
    const type_equipementService = require("../service/TypeEquipementService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");



    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], type_equipementService.insert_type_equipement);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], type_equipementService.find_all);
    router.get("/id/:id", [authService.authentication, userService.isAuthorized("readAny")], type_equipementService.find_by_id);
    router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], type_equipementService.update_type_equipement);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], type_equipementService.delete_type_equipement);
    router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], type_equipementService.delete_all);

    app.use('/api/Type_Equipement', router);
};
