import pool from "../db.js";
import bcrypt from "bcryptjs";

export const registrarUsuario = async (req, res) => {
  try {
    const {
      nombre,
      email,
      password,
      telefono,
      ciudad,
      transporte,
      edad,
      genero,
      intereses
    } = req.body;

    // Hashear la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO usuarios 
      (nombre, email, password, telefono, ciudad, transporte, edad, genero, intereses)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [nombre, email, hashedPassword, telefono, ciudad, transporte, edad, genero, intereses]
    );

    res.status(201).json({ message: "Usuario registrado", usuario: result.rows[0] });
  } catch (error) {
    console.error("Error al registrar:", error);
    res.status(500).json({ error: "Error al registrar usuario" });
  }
};
  // 👇 Nuevo método: Login
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

    res.json({
      message: "Login exitoso",
      user: { id: user.id, nombre: user.nombre, email: user.email }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

