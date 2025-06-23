import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import bcrypt from 'bcrypt';

export async function signup(req: Request, res: Response): Promise<void> {
  const { email, password, fullName } = req.body;
  if (!email || !password || !fullName) {
    res.status(400).json({ success: false, error: 'Email, password, and fullName are required' });
    return;
  }
  try {
    const user = await userService.createUser(email, password, fullName);
    const token = userService.generateToken(user);
    res.status(201).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ success: false, error: 'Email and password are required' });
    return;
  }
  try {
    const user = await userService.verifyUser(email, password);
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid credentials' });
      return;
    }
    const token = userService.generateToken(user);
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function googleAuth(req: Request, res: Response): Promise<void> {
  const { code } = req.query;
  if (!code) {
    res.status(400).json({ success: false, error: 'Authorization code is required' });
    return;
  }
  try {
    const payload = await userService.exchangeGoogleCode(code as string);
    const user = await userService.findOrCreateGoogleUser(payload);
    const token = userService.generateToken(user);
    res.redirect(`http://localhost:5173/?token=${token}`);
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
}

export async function telegramAuth(req: Request, res: Response): Promise<void> {
  const { id, first_name, last_name, username, photo_url, auth_date, hash } = req.query as Record<string, string>;
  if (!id || !auth_date || !hash) {
    res.status(400).json({ success: false, error: 'Missing required Telegram data' });
    return;
  }
  try {
    const isValid = await userService.verifyTelegramData({
      id,
      first_name,
      last_name,
      username,
      photo_url,
      auth_date: parseInt(auth_date),
      hash,
    });
    if (!isValid) {
      res.status(401).json({ success: false, error: 'Invalid Telegram data' });
      return;
    }
    const user = await userService.findOrCreateTelegramUser({
      id,
      first_name,
      last_name,
      username,
    });
    const token = userService.generateToken(user);
    res.redirect(`http://localhost:5500/telegram-signin-test.html?token=${token}`);
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }
  try {
    const user = await userService.findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}

export async function updateAccount(req: Request, res: Response): Promise<void> {
  const userId = req.user?.id;
  const { fullName, email, password, avatar } = req.body;

  if (!userId) {
    res.status(401).json({ success: false, error: 'Unauthorized' });
    return;
  }

  if (!fullName && !email && !password && avatar === undefined) {
    res.status(400).json({ success: false, error: 'At least one field (fullName, email, password, avatar) is required' });
    return;
  }

  try {
    const data: { fullName?: string; email?: string; password?: string; avatar?: string | null } = {};

    if (fullName) {
      data.fullName = fullName;
    }

    if (email) {
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        res.status(400).json({ success: false, error: 'Email already in use' });
        return;
      }
      data.email = email;
    }

    if (password) {
      if (password.length < 8) {
        res.status(400).json({ success: false, error: 'Password must be at least 8 characters long' });
        return;
      }
      data.password = await bcrypt.hash(password, 10);
    }

    if (avatar !== undefined) {
      data.avatar = avatar; // Allow null to clear avatar
    }

    const updatedUser = await userService.updateUser(userId, data);
    if (!updatedUser) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }

    res.json({ success: true, data: { id: updatedUser.id, email: updatedUser.email, fullName: updatedUser.fullName, avatar: updatedUser.avatar } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
}
