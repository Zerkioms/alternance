module.exports = app => {
    const logsService = require("../service/LogsService.js");
    const router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");


    router.get("/", [authService.authentication, userService.isAuthorized("readAny")], logsService.find_all);

    app.use('/api/Logs', router);
};