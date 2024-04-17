const jwksClient = require('jwks-rsa');
const jwt = require('jsonwebtoken');

// Créer un client pour récupérer les clés publiques
const client = jwksClient({
  jwksUri: process.env.CAS_AUTHORITY// URL de l'ensemble de clés JWK
});

// Fonction pour récupérer une clé publique à partir de l'identifiant de clé (kid)
function getKey(header, callback) {
  client.getSigningKey(header.kid, (err, key) => {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

// Fonction d'authentification
function authentication(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, getKey, (err, decoded) => {
      if (err) {
        throw new Error('Invalid token');
      } else {
        req.headers.user = decoded;
        next();
      }
    });
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
}

module.exports = {
  authentication,
  getKey
};
