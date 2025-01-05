import { Router } from 'express';
import supabase from '../../config/supabase.js';
import jwt from 'jsonwebtoken';

const router = Router();
const SECRET_KEY = process.env.SUPABASE_KEY 

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { data: userData, error: userError } = await supabase
  .from('dbo.user')
  .select('id, email, role') // Solo seleccionamos los campos relevantes
  .eq('email', email)
  .eq('password', password)  // Recuerda usar contraseñas encriptadas en producción
  .single();

if (userError) {
  console.log('Error al obtener los datos del usuario:', userError);
  return;
}
  const token = jwt.sign(
    { id: userData.id, email: userData.email, role: userData.role },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  process.env.TOKEN = token;
  process.env.ROLE = userData.role;
  process.env.USER_ID = userData.id;
  res.status(200).json({ user: userData, token });
});

router.get('/closeSession', (req, res) => {
  process.env.TOKEN = '';
  process.env.ROLE = '';
  res.status(201).json("Sesión cerrada");
});
router.get('/', async (req, res) => {
    debugger
    console.log(req.headers.authorization)
    console.log(req.headers.authorization?.split(' ')[1] != '') && req.headers.authorization?.split(' ')[1]
    if((req.headers.authorization?.split(' ')[1] != undefined && req.headers.authorization?.split(' ')[1] != '') && req.headers.authorization?.split(' ')[1] == process.env.TOKEN && (process.env.ROLE == 'ADMIN' || process.env.ROLE == 'SUPER_ADMIN') ){
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
      .from('dbo.user')
      .insert([{ username, email,password,role, created_at: new Date() }]);
  
    if (error) {
      console.log(error)
      return res.status(400).json({ error: error.message });
    }
    res.status(201).json(data);
  });

  router.get('/GetSearchUsers', async (req, res) => {
    try {
      const authToken = req.headers.authorization?.split(' ')[1];
      const { currentUserId } = req.body; 
      const limit = req.query.currentUserId; // El ID del usuario que hace la consulta
      // Leer currentUserId desde el cuerpo de la solicitud
      if (
        authToken &&
        authToken === process.env.TOKEN &&
        (process.env.ROLE === 'ADMIN' || process.env.ROLE === 'SUPER_ADMIN' || process.env.ROLE === 'USER')
      ) {
        // Consulta principal
        const { data, error } = await supabase
          .from('dbo.user')
          .select('id, image, isVisible')
          .eq('isVisible', true) // Solo usuarios visibles
          .not('id', 'eq', currentUserId) // Excluir el ID del usuario que consulta
          .not('image', 'is', null) // Asegurarse de que tienen imagen
          .limit(limit);
        if (error) {
          return res.status(400).json({ error: error.message });
        }
  
        res.status(200).json(data);
      } else {
        res.status(401).json({ message: 'Error token' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  router.post('/GetDashboard', async (req, res) => {
    try {
      const authToken = req.headers.authorization?.split(' ')[1];
      const { currentUserId } = req.body;
      console.log(currentUserId);
  
      if (
        authToken &&
        authToken === process.env.TOKEN &&
        (process.env.ROLE === 'ADMIN' || process.env.ROLE === 'SUPER_ADMIN' || process.env.ROLE === 'USER')
      ) {
        // Primera consulta: Obtener usuarios donde id sea igual al currentUserId
        const { data: usersData, error: usersError } = await supabase
          .from('dbo.user')
          .select('*')
          .eq('id', currentUserId);
  
        if (usersError) {
          return res.status(400).json({ error: usersError.message });
        }
  
        // Segunda consulta: Obtener acciones donde idUserSon coincida con currentUserId
        const { data: actionsData, error: actionsError } = await supabase
          .from('dbo.action')
          .select('*')
          .eq('idUserSon', currentUserId);
  
        if (actionsError) {
          return res.status(400).json({ error: actionsError.message });
        }
  
        // Calcular la media global de attractivePoint para todas las acciones
        const totalAttractivePoints = actionsData.reduce((total, action) => total + action.attractivePoint, 0);
        const averageAttractivePoint = actionsData.length > 0 ? totalAttractivePoints / actionsData.length : 0;
  
        // Responder con los datos de usuarios, acciones y la media calculada
        res.status(200).json({ users: usersData, actions: actionsData, averageAttractivePoint });
      } else {
        res.status(401).json({ message: 'Error token' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

  
export default router;
