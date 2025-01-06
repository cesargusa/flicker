import { Router } from 'express';
import supabase from '../../config/supabase.js';

const router = Router();
const SECRET_KEY = process.env.SUPABASE_KEY;

router.post('/upload', async (req, res) => {
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
export default router;
