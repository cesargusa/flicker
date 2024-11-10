import { Router } from 'express';
import supabase from '../../config/supabase.js';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET_KEY = process.env.SUPABASE_KEY 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: userData, error: userError } = await supabase
  .from('dbo.users')
  .select('id, email, role, companyAdminId') // Solo seleccionamos los campos relevantes
  .eq('email', email)
  .eq('password', password)  // Recuerda usar contraseñas encriptadas en producción
  .single();

if (userError) {
  console.log('Error al obtener los datos del usuario:', userError);
  return;
}

const { data: companyData, error: companyError } = await supabase
  .from('dbo.company')
  .select('urlCompanyImage')
  .eq('id', userData.companyAdminId)  // Usamos el companyAdminId obtenido del usuario
  .single();
  console.log('Usuario:', companyData);

if (companyError) {
  console.log('Error al obtener los datos de la empresa:', companyError);
  return;
}



  const token = jwt.sign(
    { id: userData.id, email: userData.email, role: userData.role ,companyImage : companyData.urlCompanyImage},
    SECRET_KEY,
    { expiresIn: '1m' }
  );

  process.env.TOKEN = token;
  process.env.ROLE = userData.role;
  res.status(200).json({ user: userData, token ,companyImage : companyData.urlCompanyImage});
});

router.get('/closeSession', (req, res) => {
  process.env.TOKEN = '';
  process.env.ROLE = '';
  res.status(201).json("Sesión cerrada");
});

export default router;
