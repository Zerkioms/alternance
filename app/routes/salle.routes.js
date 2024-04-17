module.exports = app => {
  const salles = require("../service/SalleService.js");
  var router = require("express").Router();
  const authService = require("../service/AuthenticationService");
  const userService = require("../service/UserService");


  router.post("/", [authService.authentication, userService.isAuthorized("createAny")], salles.insert_salle);
  router.get("/", [authService.authentication, userService.isAuthorized("readAny")], salles.find_all);
  router.get("/batiment/:id_batiment", [authService.authentication, userService.isAuthorized("readAny")], salles.fetchSallesByBatiment);
  router.get("/id/:id", [authService.authentication, userService.isAuthorized("readAny")], salles.find_by_id);
  router.put("/:id", [authService.authentication, userService.isAuthorized("updateAny")], salles.update_salle);
  router.delete("/:id", [authService.authentication, userService.isAuthorized("deleteAny")], salles.delete_salle);
  router.delete("/", [authService.authentication, userService.isAuthorized("deleteAny")], salles.delete_all);


  app.use('/api/salles', router);
};
