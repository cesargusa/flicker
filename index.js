import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import userRegisterRoutes from './api/routes/userRegisterRoutes.js';
import userLoginRoutes from './api/routes/userLoginRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const supabaseUrl = 'https://daavmqheycjwoipjmexk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

app.use('/users/users', userRegisterRoutes);
app.use('/users/usersLogin', userLoginRoutes);

export { app, supabase };
