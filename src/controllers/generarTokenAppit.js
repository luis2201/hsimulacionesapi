// generarTokenAppIT.js
require('dotenv').config();
const jwt = require('jsonwebtoken');

const payload = {
  Rol: 'APP',
  App: 'APPIT'
};

const secret = process.env.JWT_SECRET_APP || 'Ic3p1?3?4!';
const token = jwt.sign(payload, secret, { expiresIn: '2h' });

console.log('Token generado para AppIT:\n');
console.log(token);
