import express from 'express';
import {
  createGym,
  getAllGyms,
  getGymById,
  updateGym,
  deleteGym
} from '../controllers/gymcontroller.js';
import prisma from '../prisma/client.js';

const router = express.Router();

// CRUD Routes
router.post('/create', createGym);
router.get('/get', getAllGyms);
router.get('/getbyid/:id', getGymById);
router.put('/update/:id', updateGym);
router.delete('/delete/:id', deleteGym);

// Dropdown Route
router.get('/dropdown', async (req, res) => {
  try {
    const gyms = await prisma.gym.findMany({
      select: { id: true, name: true }
    });
    res.json(gyms);
  } catch (err) {
    console.error('Error fetching gym dropdown:', err);
    res.status(500).json({ error: 'Failed to fetch gym dropdown' });
  }
});

export default router;
