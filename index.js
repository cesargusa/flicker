import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import userRegisterRoutes from './api/routes/userRegisterRoutes.js';
import userLoginRoutes from './api/routes/userLoginRoutes.js';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config(); // Solo cargar dotenv en desarrollo
}

const supabaseUrl = 'https://daavmqheycjwoipjmexk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// Configura las rutas
app.use('/users/users', userRegisterRoutes);
app.use('/users/usersLogin', userLoginRoutes);

// Exporta una función que actúe como handler para Vercel
export default (req, res) => app(req, res);
