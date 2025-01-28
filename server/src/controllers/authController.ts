import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { Document, Types } from 'mongoose';

interface UserDocument extends Document {
  email: string;
  password: string;
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d'
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password
    }) as UserDocument;

    res.status(201).json({
      id: user._id.toString(),
      email: user.email,
      token: generateToken(user._id.toString())
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).exec() as UserDocument | null;
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      id: user._id.toString(),
      email: user.email,
      token: generateToken(user._id.toString())
    });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};