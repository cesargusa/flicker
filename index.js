// index.js

import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import userRegisterRoutes from './api/routes/userRegisterRoutes.js'; // Asegúrate de que esta ruta sea correcta
import userLoginRoutes from './api/routes/userLoginRoutes.js'; // Asegúrate de que esta ruta sea correcta
import authMiddleware  from './middleware/authMiddleware.js';
dotenv.config();

const supabaseUrl = 'https://daavmqheycjwoipjmexk.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();
app.use(express.json());

// Usa el enrutador de usuarios
app.use('/users/users', userRegisterRoutes); // Rutas de usuario estarán disponibles en '/users'
app.use('/users/usersLogin', userLoginRoutes); // Rutas de usuario estarán disponibles en '/users'

// Iniciar el servidor
const startServer = () => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor API escuchando en http://localhost:${PORT}`);
    });
};

startServer();

export { app, startServer, supabase };
