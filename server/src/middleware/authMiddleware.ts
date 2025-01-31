import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id: string;
}

// Extending Express Request types
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization required' });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token not provided' });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'fallback_secret'
    ) as JwtPayload;
    
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};