// middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ error: "Falta token" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token) return res.status(401).json({ error: "Formato inválido" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido o expirado" });
    req.user = user; // { id, email, nombre }
    next();
  });
};
