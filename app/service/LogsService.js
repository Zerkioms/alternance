
const logsRepository = require('../dao/LogsRepository');

exports.find_all = (req,res) => {
    logsRepository.find_all().then(function (logs) {
        if(logs == null || logs == undefined) {
            res.status(400).send({
                "Message": "Aucun logs n'a été récupéré",
            });
        } else {
            res.status(200).send({
                "Message" : "Les logs ont été correctement récupéré",
                "logs" : logs
            });
        }
    }).catch(function (err) {
        res.status(400).send({
            "Message": "Impossible de récupérer les logs",
            "Error": err
        })
    })
}
