module.exports = app => {
    const dataEquipementService = require("../service/DataEquipementService.js");
    var router = require("express").Router();
    const authService = require("../service/AuthenticationService");


    router.post("/", authService.authentication, dataEquipementService.insert_data_equipement);
    router.get("/", authService.authentication, dataEquipementService.find_all);
    router.get("/association/:id/caracteristiques", authService.authentication, dataEquipementService.find_caracteristiques_by_equipement);
    router.get("/id/:id", authService.authentication, dataEquipementService.find_by_id);
    router.put("/:id", authService.authentication, dataEquipementService.update_data_equipement);
    router.delete("/:id", authService.authentication, dataEquipementService.delete_data_equipement);
    router.delete("/", authService.authentication, dataEquipementService.delete_all);
    router.delete("/association/:id_association", authService.authentication, dataEquipementService.delete_data_equipement_by_association);


    app.use('/api/DataEquipement', router);
};
