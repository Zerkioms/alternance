module.exports = app => {
    const router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");
    const exportService = require("../service/ExportXLSX");

        router.get("/", [authService.authentication], exportService.exportTablesToExcel);

        app.use('/api/Export', router);
};
