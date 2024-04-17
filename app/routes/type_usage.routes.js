module.exports = app => {
    const typeUsageService = require("../service/TypeUsageService.js")
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");

    router.post("/", [authService.authentication, userService.isAuthorized("createAny")], typeUsageService.insertTypeUsage);
    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], typeUsageService.findAll);
    router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], typeUsageService.updateTypeUsage);
    router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], typeUsageService.deleteTypeUsage);

    app.use('/api/Type_Usage', router);

}