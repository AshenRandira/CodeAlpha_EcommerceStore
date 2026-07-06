import mongoose from 'mongoose';
import User from '../models/User.js';
import { verifyToken } from '../utils/jwt.js';

export async function requireAuth(req, res, next) {
  const authorization = req.get('authorization');
  const bearerMatch = authorization?.match(/^Bearer\s+(.+)$/i);
  const token = bearerMatch?.[1]?.trim();

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required.',
    });
  }

  try {
    const payload = verifyToken(token);
    const userId =
      typeof payload === 'object' && payload !== null ? payload.sub : null;

    if (!userId || !mongoose.isValidObjectId(userId)) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    const isTokenError = [
      'JsonWebTokenError',
      'TokenExpiredError',
      'NotBeforeError',
    ].includes(error.name);

    if (isTokenError) {
      return res.status(401).json({
        message: 'Authentication required.',
      });
    }

    return next(error);
  }
}
