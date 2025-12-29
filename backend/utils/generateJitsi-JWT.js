// backend/utils/generateJitsi-JWT.js
const jwt = require('jsonwebtoken');
const fs = require('fs');    // Import the fs (file system) and path modules to read the private key file
const path = require('path');

const privateKeyPath = path.join(__dirname, '../../8x8 Jitsi as a Service/Key 7_4_2024, 3_45_30 AM.pk');
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');

const generateJitsiJWT = (user, room) => {
  // Define the payload object that will be encoded into the JWT
  const payload = {
    aud: 'jitsi', // Audience claim, specifies the intended recipient of the token (here, 'jitsi')
    context: {
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        avatar: user.avatar,
        email: user.email,
        moderator: user.isModerator ? 'true' : 'false', // Whether the user is a moderator (boolean converted to string)
      },
      features: {
        livestreaming: 'false',   // Disable livestreaming feature
        "outbound-call": 'false', // Disable outbound calling feature
        transcription: 'false',   // Disable transcription feature
        recording: 'false',       // Disable recording feature
      },
      room: {
        regex: false, // Room name is not a regular expression
      }
    },
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // Token expiration time (current time in seconds + 1 hour)
    iss: 'chat', // Issuer claim, identifies the principal that issued the token (here, 'chat')
    nbf: Math.floor(Date.now() / 1000) - 10, // Not Before claim, token is not valid before 10 seconds ago
    room: room || '*', // Room name, default to '*' if not provided
    sub: 'vpaas-magic-cookie-eadd3ab1f9204e1d8721beef17832947' 
  };

  // Define options for signing the JWT
  const options = {
    algorithm: 'RS256', // Algorithm used to sign the token (RS256 is RSA signature with SHA-256)
    header: {
      alg: 'RS256', // Algorithm header parameter
      kid: 'vpaas-magic-cookie-eadd3ab1f9204e1d8721beef17832947/0dcb8c', // Key ID header parameter, identifies the key used to sign the token
      typ: 'JWT' // Type header parameter, indicates the type of token (here, 'JWT')
    }
  };

  // Sign the JWT with the payload, private key, and options, and return the resulting token
  return jwt.sign(payload, privateKey, options);
};

module.exports = generateJitsiJWT;
