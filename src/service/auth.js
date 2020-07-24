require("dotenv").config();
const request = require("request")
const axios = require('axios').default;
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function(error, key) {
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

async function generateToken() {
    const response = axios({
        method: 'post',
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        headers: { 'content-type': 'application/json' },
        data: {
               client_id: process.env.CLIENT_ID,
               client_secret: process.env.CLIENT_SECRET,
               audience: 'https://gql-twitter-api',
               grant_type: 'client_credentials',
        }
    }).then(r => r.data.access_token);
    
    return response;
}

async function isTokenValid(token) {
  if (token) {
    const bearerToken = token.split(" ");
    const result = new Promise((resolve, reject) => {
      jwt.verify(
        bearerToken[1],
        getKey,
        {
          audience: process.env.API_IDENTIFIER,
          issuer: `https://${process.env.AUTH0_DOMAIN}/`,
          algorithms: ["RS256"]
        },
        (error, decoded) => {
          if (error) {
            resolve({ error });
          }
          if (decoded) {
            resolve({ decoded });
          }
        }
      );
    });

    return result;
  }

  return { error: "No token provided" };
}

module.exports.isTokenValid = isTokenValid;
module.exports.generateToken = generateToken;