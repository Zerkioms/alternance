module.exports = app => {
    const router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");

        router.get("/", [authService.authentication], userService.find_all);
        router.get("/uid/:uid", userService.find_by_uid);
        router.get("/roles", [authService.authentication], userService.findRoles);
        router.put("/role/:id", [authService.authentication], userService.updateRole);
    
        app.use('/api/User', router);
};
