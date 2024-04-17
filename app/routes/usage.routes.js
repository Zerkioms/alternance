module.exports = app => {
    const UsageService = require("../service/UsageService.js")
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService.js");
    const userService = require("../service/UserService.js");

    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], UsageService.insertUsage);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], UsageService.findAll);
    router.get("/salle/:id_salle", [authService.authentication, userService.isAuthorized("readAny")], UsageService.findAllBySalle);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], UsageService.deleteUsage);

    app.use('/api/Usage', router);

}