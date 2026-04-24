// generarTokenAppIT.js
const jwt = require('jsonwebtoken');

const payload = {
  Rol: 'APP',
  App: 'APPIT'
};

const secret = 'Ic3p1?3?4!'; // Debe coincidir con el de .env

const token = jwt.sign(payload, secret /*, { expiresIn: '30d' } */);

console.log('Token generado para AppIT:\n');
console.log(token);
