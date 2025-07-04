const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const permissionsRoutes = require('./routes/permissions.routes');
const tecnicoRoutes = require('./routes/tecnico.routes');
const salaRoutes = require('./routes/sala.routes');
const tipopracticaRoutes = require('./routes/tipopractica.routes');
const reservaRoutes = require('./routes/reserva.routes');

const db = require('./config/db');
const app = express();

dotenv.config();

// Configuración de CORS para aceptar conexiones desde un subdominio específico
// const corsOptions = {
//     origin: [
//         'https://hsimulaciones.luispincay.com',
//         'https://hsimulacionesapi.luispincay.com',
//         'https://appit.luispincay.com/'
//     ],
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     credentials: true
// };
// app.use(cors(corsOptions));

// Obtener los orígenes permitidos desde el archivo .env
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    // Permitir sin origin (por ejemplo, en herramientas como curl o Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS no permitido para este origen: ' + origin));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos MySQL');
});

// Configuración
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/permissions', permissionsRoutes);
app.use('/api/tecnicos', tecnicoRoutes);
app.use('/api/salas', salaRoutes);
app.use('/api/tipopracticas', tipopracticaRoutes);
app.use('/api/reservas', reservaRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
