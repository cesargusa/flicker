import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import usersRoutes from './api/routes/userRoutes.js';
import actionRoute from './api/routes/actionRoutes.js';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Solo cargar dotenv en desarrollo
}

const supabaseUrl = 'https://vrrgusfrgazctcldrryo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(cors());
app.use(express.json());

// Configura las rutas
app.use('/users', usersRoutes);
app.use('/action', actionRoute);



app.post('/upload', async (req, res) => {
  const { currentUserId ,img} = req.body; // Asumimos que `newImageUrl` es la nueva URL de la imagen
console.log(img)
const { data, error } = await supabase
  .from('dbo.user') // Asegúrate de que la tabla es 'dbo.user'
  .update({ image: img }) // Actualizamos el campo 'image_url'
  .eq('id', currentUserId); // Buscamos la fila por el 'user_id'

if (error) {
  console.log("Error al actualizar la base de datos:", error);
  return res.status(400).json({ error: error.message });
}

res.status(200).json({
  message: 'Imagen actualizada correctamente para el usuario',
  updatedUser: data, // Los datos del usuario actualizados
});

  
});

// Configura el puerto (si estás en local puedes usar un puerto como 3000)
const PORT = process.env.PORT || 3000;  // Usa el puerto definido en .env o 3000 por defecto

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exporta una función que actúe como handler para Vercel (si es necesario)
export default (req, res) => app(req, res);
