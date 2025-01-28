import { Router, RequestHandler } from 'express';
import { createTask, getTasksByDate, updateTask, deleteTask } from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Всі роути захищені middleware аутентифікації
router.use(authMiddleware as RequestHandler);

// Task routes
router.post('/', createTask as RequestHandler);
router.get('/date/:date', getTasksByDate as RequestHandler);
router.put('/:id', updateTask as RequestHandler);
router.delete('/:id', deleteTask as RequestHandler);

export default router;