import { Router } from 'express';
import supabase from '../../config/supabase.js';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET_KEY = process.env.SUPABASE_KEY 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: userData, error } = await supabase
    .from('dbo.users')
    .select('id, email, role')
    .eq('email', email)
    .eq('password', password) // Nota: En producción, usa una contraseña encriptada
    .single();

  if (error || !userData) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign(
    { id: userData.id, email: userData.email, role: userData.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  process.env.TOKEN = token;
  process.env.ROLE = userData.role;
  res.status(200).json({ user: userData, token, role: userData.role });
});

router.get('/closeSession', (req, res) => {
  process.env.TOKEN = '';
  process.env.ROLE = '';
  res.status(201).json("Sesión cerrada");
});

export default router;
