// backend/models/usuario.js
import mongoose from 'mongoose';

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telefono: { type: String },
  ciudad: { type: String },
  transporte: { type: String },
  edad: { type: Number },
  genero: { type: String },
  intereses: { type: String },
}, {
  timestamps: true
});

export default mongoose.model('Usuario', usuarioSchema);