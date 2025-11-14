import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();

// 🧾 Middleware para mostrar todas las peticiones (antes de las rutas)
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// 🌐 Configuración de CORS
app.use(cors({
  origin: [
    "http://localhost:8100",     // navegador (ionic serve)
    "http://192.168.1.17:8100",  // dispositivo físico Android
    "http://10.0.2.2:8100"       // emulador Android Studio
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// 📦 Middleware para parsear JSON en peticiones
app.use(express.json());

// 🚀 Rutas principales del backend
app.use("/api", authRoutes);

// ⚙️ Puerto
const PORT = process.env.PORT || 4000;

// 🖥️ Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor backend corriendo en:
  👉 Local:     http://localhost:${PORT}
  👉 Red local: http://192.168.1.17:${PORT}
  `);
  
app.use(cookieParser());
});
