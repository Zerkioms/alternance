const express = require("express");
const cors = require("cors");
const requestLogger = require('./app/modules/express-sequelize-logger');
const db = require("./app/models");

require('dotenv').config()

const app = express();

let corsOptions = {
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

require("./app/routes/zone.routes")(app);
require("./app/routes/batiment.routes")(app);
require("./app/routes/salle.routes")(app);
require("./app/routes/type_equipement.routes")(app);
require("./app/routes/type_usage.routes")(app);
require("./app/routes/usage.routes")(app);
require("./app/routes/caracteristique.routes")(app);
require("./app/routes/association.routes")(app);
require("./app/routes/data_equipement.routes")(app);
require("./app/routes/data_modele.routes")(app);
require("./app/routes/modele_equipement.routes")(app);
require("./app/routes/type_salle.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/document.routes")(app);
require("./app/routes/recherche.routes")(app);
require("./app/routes/export_xlsx.routes")(app);
require("./app/routes/logs.routes")(app);

app.use(requestLogger({ sequelize: db.sequelize, models: db.models })); 


const Op = db.Sequelize.Op;
const Roles = db.role;



 db.sequelize.sync({ alter: true }).then(() => {
  let roles = ["admin", "operateur", "visiteur"]
  roles.forEach((role) => {
    Roles.findOrCreate({
      where: {role: role},
      defaults:{
        role: role
      }
    })
  })

   console.log("Drop and re-sync db.");
 }).catch((err) => {
  console.log("Failed to sync db: " + err.message);
});


app.set('host', 'varese-wifi.univ-lr.fr');

const PORT = parseInt(process.env.PORT, 10);
app.listen(PORT, () => {
  console.log(`Server is running on http://${app.get('host')}:${PORT}.`);
});
app.get('/health-check',(req,res)=> {
  res.send ("OK");
});
