import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

// 🧾 Middleware para mostrar todas las peticiones (ANTES DE TODO)
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

// 🌐 Configuración de CORS
app.use(cors({
  origin: [
    "http://localhost:8100",
    "http://192.168.1.2:8100",
    "http://10.0.2.2:8100",
    "capacitor://localhost",
    "ionic://localhost",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use("*", cors());

// 📦 Middleware global
app.use(express.json());
app.use(cookieParser());

// 🚀 Rutas API
app.use("/api", authRoutes);

// ⚙️ Puerto
const PORT = process.env.PORT || 4000;

// 🖥️ Iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Servidor backend corriendo en:
  👉 Local:     http://localhost:${PORT}
  👉 Red local: http://192.168.1.2:${PORT}
  `);
});
