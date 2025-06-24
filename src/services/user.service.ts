import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import crypto from 'crypto';

const prisma = new PrismaClient();

const client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: 'https://maqsaddosh-backend-o2af.onrender.com/api/google',
});

export async function createUser(email: string, password: string, fullName: string) {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      fullName,
      email,
      password: hashedPassword,
    },
  });
}

export async function verifyUser(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user || !user.password) {
    return null;
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return null;
  }
  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, fullName: true, googleId: true, telegramId: true, avatar: true },
  });
}

export async function updateUser(id: string, data: { fullName?: string; email?: string; password?: string; avatar?: string | null }) {
  return prisma.user.update({
    where: { id },
    data,
    select: { id: true, email: true, fullName: true, avatar: true },
  });
}

export async function exchangeGoogleCode(code: string): Promise<TokenPayload> {
  const { tokens } = await client.getToken({
    code,
    redirect_uri: 'https://maqsaddosh-backend-o2af.onrender.com/api/google',
  });
  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token!,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new Error('Invalid Google token');
  }
  return payload;
}

export async function findOrCreateGoogleUser(payload: TokenPayload) {
  const email = payload.email!;
  const googleId = payload.sub;
  const avatar = payload.picture; // Google profile picture URL
  let user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    if (!user.googleId || !user.avatar) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar },
      });
    }
  } else {
    user = await prisma.user.create({
      data: {
        email,
        googleId,
        fullName: payload.name!,
        avatar,
      },
    });
  }
  return user;
}

export function generateToken(user: { id: string; email: string }) {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'your-secret-key');
}

export async function verifyTelegramData(data: {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}): Promise<boolean> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const dataCheckString = Object.keys(data)
    .filter((key) => key !== 'hash')
    .sort()
    .map((key) => `${key}=${data[key as keyof typeof data]}`)
    .join('\n');

  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');

  return hmac === data.hash && Date.now() / 1000 - data.auth_date < 86400;
}

export async function findOrCreateTelegramUser(data: {
  id: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  email?: string;
}) {
  const telegramId = data.id;
  let user = await prisma.user.findUnique({
    where: { telegramId },
  });
  if (!user && data.email) {
    user = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (user) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { telegramId },
      });
    }
  }
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: data.email || `${telegramId}@telegram.placeholder`,
        telegramId,
        fullName: ([data.first_name, data.last_name].filter(Boolean).join(' ') || data.username) ?? 'Telegram User',
      },
    });
  }
  return user;
}
