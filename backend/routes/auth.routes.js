// routes/auth.routes.js
import express from 'express';
import { registrarUsuario, loginUsuario, refreshToken, logoutUsuario } from '../controllers/auth.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';
import pool from "../db.js";


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
router.put("/usuarios/perfil", verificarToken, async (req, res) => {
  try {
    // req.user viene del middleware verificarToken
    const userId = req.user.id;

    // Datos que vienen del frontend
    const { nombre, telefono, ciudad, transporte, edad, genero, intereses } = req.body;

    // Actualiza en la base de datos usando PostgreSQL
    const result = await pool.query(
      `UPDATE usuarios 
       SET nombre = $1, telefono = $2, ciudad = $3, transporte = $4, edad = $5, genero = $6, intereses = $7
       WHERE id = $8
       RETURNING id, nombre, email, telefono, ciudad, transporte, edad, genero, intereses`,
      [nombre, telefono, ciudad, transporte, edad, genero, intereses, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json({
      success: true,
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar perfil" });
  }
});

export default router;
