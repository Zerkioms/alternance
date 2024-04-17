module.exports = app => {
    const rechercheService = require("../service/RechercheService.js");
    const router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");


    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], rechercheService.find_all);

    app.use('/api/Recherche', router);
};