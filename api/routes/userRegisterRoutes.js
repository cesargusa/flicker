// api/routes/userRoutes.js

import { Router } from 'express'; // Importa Router de Express
import supabase from '../../config/supabase.js'; // Asegúrate de que la ruta sea correcta

const router = Router(); // Crea una instancia del enrutador

// Ruta para obtener usuarios
router.get('/', async (req, res) => {
  if((req.headers.authorization?.split(' ')[1] != undefined && req.headers.authorization?.split(' ')[1] != '') && req.headers.authorization?.split(' ')[1] == process.env.TOKEN && process.env.ROLE == 1 ){
    const { data, error } = await supabase.from('dbo.users').select('*');

    if (error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(200).json(data);
  }else res.status(401).json({"message":"Error token"});
 
});

// Ruta para insertar un nuevo usuario
router.post('/', async (req, res) => {
  const { username, email, password,role } = req.body;
  const { data, error } = await supabase
    .from('dbo.users')
    .insert([{ username, email,password,role, created_at: new Date() }]);

  if (error) {
    console.log(error)
    return res.status(400).json({ error: error.message });
  }
  res.status(201).json(data);
});

export default router; 