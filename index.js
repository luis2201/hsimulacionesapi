const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/auth.routes');
const permissionsRoutes = require('./src/routes/permissions.routes');
const tecnicoRoutes = require('./src/routes/tecnico.routes');
const salaRoutes = require('./src/routes/sala.routes');
const tipopracticaRoutes = require('./src/routes/tipopractica.routes');
const reservaRoutes = require('./src/routes/reserva.routes');
const carreraRoutes = require('./src/routes/carrera.routes');

const db = require('./src/config/db');
const app = express();

dotenv.config();

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
      console.warn(`CORS bloqueado para origen: ${origin}`);
      callback(null, false); // No lanza error
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
app.use('/api/carreras', carreraRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
