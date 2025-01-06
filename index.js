import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import usersRoutes from './api/routes/userRoutes.js';
import actionRoute from './api/routes/actionRoutes.js';
import imageRoute from './api/routes/imageRoutes.js';

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
app.use('/', imageRoute);




// Configura el puerto (si estás en local puedes usar un puerto como 3000)
const PORT = process.env.PORT || 3000;  // Usa el puerto definido en .env o 3000 por defecto

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Exporta una función que actúe como handler para Vercel (si es necesario)
export default (req, res) => app(req, res);
