import jwt from 'jsonwebtoken';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET?.trim();

  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  return secret;
}

export function generateToken(userId) {
  if (!userId) {
    throw new Error('Cannot generate a JWT without a user ID.');
  }

  return jwt.sign(
    {
      sub: userId.toString(),
    },
    getJwtSecret(),
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
}

export function verifyToken(token) {
  return jwt.verify(token, getJwtSecret());
}
