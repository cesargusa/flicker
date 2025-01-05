import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import usersRoutes from './api/routes/userRoutes.js';
import actionRoute from './api/routes/actionRoutes.js';

import cors from 'cors';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Solo cargar dotenv en desarrollo
}

const supabaseUrl = 'https://vrrgusfrgazctcldrryo.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

const app = express();
app.use(cors());
app.use(express.json());

app.use('/users',usersRoutes);
app.use('/action', actionRoute);

const PORT = process.env.PORT || 3000;  // Usa el puerto definido en .env o 3000 por defecto

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default (req, res) => app(req, res);
