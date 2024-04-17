module.exports = app => {
    const batiments = require("../service/BatimentService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");


    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], batiments.insert_batiment);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], batiments.find_all);
    router.get("/id/:id", [authService.authentication, userService.isAuthorized("readAny")], batiments.find_by_id);
    router.get("/zone/:id_zone", [authService.authentication, userService.isAuthorized("readAny")], batiments.fetchBatimentsByZone);
    router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], batiments.update_batiment);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], batiments.delete_batiment);
    router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], batiments.delete_all);

    app.use('/api/batiments', router);
};
