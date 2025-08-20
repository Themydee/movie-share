// server/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import { DecodedToken } from '../types';

declare module 'express' {
  interface Request {
    user?: DecodedToken;
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as DecodedToken;
    const user = await User.findOne({ id: decoded.userId, email: decoded.email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Unauthorized: User not found' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }
};