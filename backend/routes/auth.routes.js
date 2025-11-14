// routes/auth.routes.js
import express from 'express';
import { registrarUsuario, loginUsuario, refreshToken, logoutUsuario } from '../controllers/auth.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Registro y login
router.post("/register", registrarUsuario);
router.post("/login", loginUsuario);
router.post("/refresh", refreshToken);
router.post("/logout", logoutUsuario);

// Ejemplo de ruta protegida
router.get("/usuarios/perfil", verificarToken, (req, res) => {
  res.json({ message: "Acceso permitido", user: req.user });
});

export default router;
