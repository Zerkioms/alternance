const pjlink = require('pjlink')

 function defineProjector(ip_address) {
    return  new pjlink(ip_address)
}

exports.connection = (req, res) => {
    const projector = defineProjector(req.body.ip_address)
    projector._connect()
    console.log('Connexion au vidéoprojecteur établie.')
}

exports.powerProjector = (req, res) => {
    console.log(getPowerState())
}



function turnOnProjector() {
    projector.powerOn((error) => {
        if (error) {
          console.error('Erreur lors de la mise sous tension du vidéoprojecteur', error);
          return;
        }
      
        console.log('Vidéoprojecteur allumé avec succès');
      });
}

function turnOffProjector(projector) {
    projector.powerOff((error) => {
        if (error) {
          console.error('Erreur lors de la mise hors tension du vidéoprojecteur', error);
          return;
        }
      
        console.log('Vidéoprojecteur éteint avec succès');
      });
}


function getPowerState() {    
    setInterval(() => {
        let state = projector.getPowerState((error) => {
            if(error) {
                console.log("Une erreur s'est produite lors de la récupération de l'état du vidéoprojecteur", error)
                return
            }
            return state
        })
        }, 5000);    
}

function disconnect(projector) {
    return projector.disconnect();
  }
