import { Response, Request } from 'express';
import Task from '../models/Task';
import { AuthRequest } from '../middleware/authMiddleware';

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { text, date, order } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const task = new Task({
      text,
      date,
      order,
      userId
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
};

export const getTasksByDate = async (req: AuthRequest, res: Response) => {
  try {
    const { date } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({ userId, date })
      .sort({ order: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

export const getTasksByDateRange = async (req: AuthRequest, res: Response) => {
  try {
    const { startDate, endDate } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const tasks = await Task.find({
      userId,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ order: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { text, date, order, status } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    console.log('Server - Updating task:', { id, text, date, order, status });

    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      { text, date, order, status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Server - Updated task:', task);
    res.json(task);
  } catch (error) {
    console.error('Server - Error updating task:', error);
    res.status(500).json({ message: 'Error updating task', error });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
};

export const getPublicTasksByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.params;

    const tasks = await Task.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ date: 1, order: 1 });
    
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching public tasks', error });
  }
};