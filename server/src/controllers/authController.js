import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';

const BCRYPT_SALT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function getSafeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function register(req, res, next) {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = normalizeEmail(req.body.email);
    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({
        message: 'Name must be between 2 and 60 characters.',
      });
    }

    if (!EMAIL_PATTERN.test(email)) {
      return res.status(400).json({
        message: 'A valid email address is required.',
      });
    }

    if (
      password.length < 8 ||
      Buffer.byteLength(password, 'utf8') > 72
    ) {
      return res.status(400).json({
        message: 'Password must be at least 8 characters and at most 72 bytes.',
      });
    }

    const existingUser = await User.exists({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'An account with this email already exists.',
      });
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.email) {
      return res.status(400).json({
        message: 'An account with this email already exists.',
      });
    }

    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email);
    const password =
      typeof req.body.password === 'string' ? req.body.password : '';

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required.',
      });
    }

    const user = await User.findOne({ email }).select('+passwordHash');

    const passwordMatches = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;

    if (!user || !passwordMatches) {
      return res.status(401).json({
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: getSafeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export function getMe(req, res) {
  return res.status(200).json({
    user: getSafeUser(req.user),
  });
}
