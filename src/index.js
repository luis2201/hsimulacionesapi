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
const recursoRoutes = require('./routes/recurso.routes');
const carreraRoutes = require('./routes/carrera.routes');

const db = require('./config/db');
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
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`CORS bloqueado para origen: ${origin}`);
        callback(null, false); // No lanza error
      }
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
};

app.use(cors(corsOptions));

// Conectar a la base de datos
// db.connect((err) => {
//     if (err) {
//         console.error('Error conectando a la base de datos:', err);
//         process.exit(1);
//     }
//     console.log('Conectado a la base de datos MySQL');
// });
db.query('SELECT 1', (err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos MySQL');
});

// Configuración
app.use(express.json());

// ===================== HEALTH CHECK ===================== //
app.get('/health', (req, res) => {
  const start = Date.now();

  db.query('SELECT 1 AS ok', (err, results) => {
    const responseTime = Date.now() - start;

    if (err) {
      return res.status(500).json({
        status: 'error',
        service: 'hsimulacionesapi',
        db: 'disconnected',
        error: err.code,
        timestamp: new Date().toISOString()
      });
    }

    res.status(200).json({
      status: 'ok',
      service: 'hsimulacionesapi',
      uptime: process.uptime(),
      db: results[0]?.ok === 1 ? 'connected' : 'unknown',
      responseTimeMs: responseTime,
      memoryUsageMB: (process.memoryUsage().rss / 1024 / 1024).toFixed(2),
      timestamp: new Date().toISOString()
    });
  });
});

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
app.use('/api/recursos', recursoRoutes);
app.use('/api/carreras', carreraRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
