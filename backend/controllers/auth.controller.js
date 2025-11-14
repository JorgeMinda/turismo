// controllers/auth.controller.js
import pool from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const REFRESH_SECRET = process.env.REFRESH_SECRET;
const REFRESH_EXPIRES_IN = process.env.REFRESH_EXPIRES_IN || "7d";

// Función auxiliar: genera tokens
const generarAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, nombre: user.nombre },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

const generarRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN });
};

// ✅ Registro de usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, telefono, ciudad, transporte, edad, genero, intereses } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios 
       (nombre, email, password, telefono, ciudad, transporte, edad, genero, intereses)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, nombre, email`,
      [nombre, email, hashedPassword, telefono, ciudad, transporte, edad, genero, intereses]
    );

    const nuevoUsuario = result.rows[0];
    res.status(201).json({ message: "Usuario registrado correctamente", usuario: nuevoUsuario });
  } catch (error) {
    console.error("❌ Error al registrar:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};

// ✅ Login con JWT
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM usuarios WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    // Generar tokens
    const accessToken = generarAccessToken(user);
    const refreshToken = generarRefreshToken(user);

    // Guardar refresh token opcionalmente en BD
    await pool.query("UPDATE usuarios SET refresh_token = $1 WHERE id = $2", [refreshToken, user.id]);

    // Enviar cookie httpOnly (solo accesible por backend)
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 3600 * 1000, // 7 días
    });

    res.json({
      message: "Login exitoso",
      accessToken,
      user: { id: user.id, nombre: user.nombre, email: user.email },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ✅ Endpoint para renovar token
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ error: "No hay token de refresco" });

    // Verificar refresh token
    jwt.verify(token, REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Token inválido o expirado" });

      const result = await pool.query("SELECT * FROM usuarios WHERE id = $1", [decoded.id]);
      if (result.rows.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

      const newAccessToken = generarAccessToken(result.rows[0]);
      res.json({ accessToken: newAccessToken });
    });
  } catch (error) {
    console.error("Error al refrescar token:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

// ✅ Cierre de sesión
export const logoutUsuario = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await pool.query("UPDATE usuarios SET refresh_token = NULL WHERE refresh_token = $1", [token]);
      res.clearCookie("refreshToken");
    }
    res.json({ message: "Sesión cerrada correctamente" });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({ error: "Error al cerrar sesión" });
  }
};
