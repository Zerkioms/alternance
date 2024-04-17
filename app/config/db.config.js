module.exports = {
    //le nom de la BDD
    database: process.env.DB_NAME,
    //Le nom du user qui se connecte à la base de données
    username: process.env.DB_USER,
    //le mot de passe du user
    password: process.env.DB_PASSWORD,
    //Le serveur sur lequel tourne la base de données (pour le moment localhost)
    host: process.env.DB_HOST,
    //Le dialecte utilisé par la base de données (exemple: MySQL)
    dialect: process.env.DB_DIALECT,
    //le port de la bdd par defaut le 5432
    port: process.env.DB_PORT || '5432',
    pool: {
        //Nombre de connexions en simultanées à la base de données autorisées
        max: parseInt(process.env.DB_POOL_MAX, 10),
        min: parseInt(process.env.DB_POOL_MIN, 10),
        acquire: parseInt(process.env.DB_ACQUIRE, 10),
        idle: parseInt(process.env.DB_IDLE, 10)
}
};
