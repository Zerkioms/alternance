module.exports = app => {
    const documentService = require("../service/DocumentService.js");
    const router = require("express").Router();
    const authService = require("../service/AuthenticationService");
    const userService = require("../service/UserService");

    router.post("/", [authService.authentication], documentService.insertDocument);
    router.delete("/:id", [authService.authentication], documentService.deleteDocument);
    router.get("/salle/:id", [authService.authentication], documentService.findBySalle);
    router.get("/modele/:id_modele", [authService.authentication], documentService.findByModele);
    router.get("/association/:id_association", [authService.authentication], documentService.findByAssociation);

        app.use('/api/Document', router);
};
