import { Router, RequestHandler } from 'express';
import { 
  createTask, 
  getTasksByDate, 
  getTasksByDateRange, 
  updateTask, 
  deleteTask,
  getPublicTasksByDateRange 
} from '../controllers/taskController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Public route - no auth required
router.get('/public/date/:startDate/:endDate', getPublicTasksByDateRange as RequestHandler);

// All routes below are protected by authentication middleware
router.use(authMiddleware as RequestHandler);

// Protected task routes
router.post('/', createTask as RequestHandler);
router.get('/date/:date', getTasksByDate as RequestHandler);
router.get('/date/:startDate/:endDate', getTasksByDateRange as RequestHandler);
router.put('/:id', updateTask as RequestHandler);
router.delete('/:id', deleteTask as RequestHandler);

export default router;