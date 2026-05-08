import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { env } from '../config/env.js';

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
  return { accessToken, refreshToken };
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(`[Auth] Attempting registration for: ${email}`);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    const tokens = generateTokens(user.id);

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
    console.log(`[Auth] Registration successful for: ${email}`);
  } catch (error) {
    console.error(`[Auth] Registration error:`, error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(`[Auth] Attempting login for: ${email}`);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tokens = generateTokens(user.id);

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      ...tokens,
    });
    console.log(`[Auth] Login successful for: ${email}`);
  } catch (error) {
    console.error(`[Auth] Login error:`, error);
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { token } = req.body;

    let payload;
    try {
      payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }

    const tokens = generateTokens(user.id);
    res.json(tokens);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Client-side deletes token, so we just acknowledge it.
    // If you add token blacklisting or store refresh tokens in DB, do it here.
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};
