import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import pool from './db.js';

dotenv.config();

const app = express();

// TEST
app.get('/ping', (req, res) => res.json({ message: 'Pong!' }));
app.get('/test', (req, res) => res.send('Servidor funcionando!'));

// LOG PETICIONES
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// CORS PARA RENDER
app.use(cors({
  origin: [
    "http://localhost:8100",
    "http://127.0.0.1",
    "capacitor://localhost",
    "ionic://localhost",
    process.env.FRONTEND_URL='https://turismo-yr0h.onrender.com/api' // ← agrega tu URL cuando la tengas
    , "*"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// RUTAS
app.use("/api", authRoutes);

// PUERTO DINÁMICO
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

// DB TEST
pool.query('SELECT NOW()', (err, res) => {
  if (err) console.error('❌ Error DB:', err);
  else console.log('✅ DB OK:', res.rows);
});
