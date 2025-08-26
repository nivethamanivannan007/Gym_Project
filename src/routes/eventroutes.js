import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/eventcontroller.js';
import prisma from '../prisma/client.js';

const router = express.Router();

// CRUD Routes
router.post('/create', createEvent);
router.get('/get', getAllEvents);
router.get('/getbyid/:id', getEventById);
router.put('/update/:id', updateEvent);
router.delete('/delete/:id', deleteEvent);

// Dropdown Route
router.get('/dropdown', async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      select: { id: true, name: true }
    });
    res.json(events);
  } catch (err) {
    console.error('Error fetching event dropdown:', err);
    res.status(500).json({ error: 'Failed to fetch event dropdown' });
  }
});

export default router;
