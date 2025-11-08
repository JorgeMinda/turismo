import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"; // ✅ importa tus rutas

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
  origin: "http://localhost:8100",
  methods: ["GET", "POST"],
  credentials: true
}));
app.use(express.json());

// ✅ Rutas
app.use("/api", authRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
