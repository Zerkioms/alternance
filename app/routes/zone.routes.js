module.exports = app => {
    const zoneService = require("../service/ZoneService.js");
    const router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");


        router.post("/", [authService.authentication, userService.isAuthorized("createAny")], zoneService.insert_zone );
        router.get("/", [authService.authentication, userService.isAuthorized("readAny")], zoneService.find_all);
        router.get("/id/:id_zone", [authService.authentication, userService.isAuthorized("readAny")], zoneService.find_by_id);
        router.put("/:id_zone", [authService.authentication, userService.isAuthorized("updateAny")], zoneService.update_zone);
        router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], zoneService.delete_zone);
        router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], zoneService.delete_all);
    
        app.use('/api/Zone', router);
};
