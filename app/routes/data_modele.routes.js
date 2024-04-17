module.exports = app => {
    const dataModeleService = require("../service/DataModeleService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");


    router.post("/", authService.authentication, dataModeleService.insert_data_modele);
    router.get("/", authService.authentication, dataModeleService.find_all);
    router.get("/id/:id", authService.authentication, dataModeleService.find_by_id);
    router.get("/:id/caracteristiques", authService.authentication, dataModeleService.fetchCaracteristiquesModele);
    router.put("/:id", authService.authentication, dataModeleService.update_data_modele);
    router.delete("/:id", authService.authentication, dataModeleService.delete_data_modele);
    router.delete("/", authService.authentication, dataModeleService.delete_all);
    router.delete("/modele_equipement/:id", authService.authentication, dataModeleService.deleteCaracteristiquesByModele)

    app.use('/api/DataModele', router);
};
