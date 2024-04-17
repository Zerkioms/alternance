module.exports = app => {
    const typeSalleService = require("../service/TypeSalleService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");


    router.post("/", authService.authentication, typeSalleService.insert_type_salle);
    router.get("/", authService.authentication, typeSalleService.find_all);
    router.get("/id/:id", authService.authentication, typeSalleService.find_by_id);
    router.get("/designation", authService.authentication, typeSalleService.find_by_designation);
    router.put("/:id", authService.authentication, typeSalleService.update_type_salle);
    router.delete("/:id", authService.authentication, typeSalleService.delete_type_salle);
    router.delete("/", authService.authentication, typeSalleService.delete_all);

    app.use('/api/TypeSalle', router);
};
