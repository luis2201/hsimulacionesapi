// generarTokenAppIT.js
const jwt = require('jsonwebtoken');

const payload = {
  Rol: 'USUARIO',
  App: 'APPIT'
};

const secret = process.dotenv.JWT_SECRET_APP;

const token = jwt.sign(payload, secret , { expiresIn: '2h' } );

console.log('Token generado para AppIT:\n');
console.log(token);
