import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import speakeasy from "speakeasy";
import rateLimit from "express-rate-limit";
import crypto from "crypto";
import { storage } from "./storage";

export interface AdminAuthRequest extends Request {
  adminUser?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
  sessionToken?: string;
}

const activeSessions = new Map<string, {
  adminUserId: string;
  expiresAt: Date;
  ipAddress: string;
}>();

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

export const adminRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later",
  standardHeaders: true,
  legacyHeaders: false,
});

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error('Error verifying password:', error);
    return false;
  }
}

export function verifyTOTP(token: string, secret: string): boolean {
  try {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2,
    });
  } catch (error) {
    console.error('Error verifying TOTP:', error);
    return false;
  }
}

export function generateTOTPSecret(): { secret: string; qrCode: string } {
  const secret = speakeasy.generateSecret({
    name: 'Admin Dashboard',
    length: 32,
  });
  
  return {
    secret: secret.base32,
    qrCode: secret.otpauth_url || '',
  };
}

export function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

export async function createSession(adminUserId: string, ipAddress: string): Promise<string> {
  const sessionToken = generateSessionToken();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  activeSessions.set(sessionToken, {
    adminUserId,
    expiresAt,
    ipAddress,
  });
  
  try {
    await storage.createAdminSession({
      adminUserId,
      sessionToken,
      expiresAt,
    });
  } catch (error) {
    console.error('Error saving session to database:', error);
  }
  
  return sessionToken;
}

export async function validateSession(sessionToken: string, ipAddress: string): Promise<boolean> {
  const session = activeSessions.get(sessionToken);
  
  if (!session) {
    return false;
  }
  
  if (session.expiresAt < new Date()) {
    activeSessions.delete(sessionToken);
    return false;
  }
  
  if (session.ipAddress !== ipAddress) {
    console.warn('Session IP mismatch:', { expected: session.ipAddress, actual: ipAddress });
    return false;
  }
  
  return true;
}

export async function destroySession(sessionToken: string): Promise<void> {
  activeSessions.delete(sessionToken);
  
  try {
    await storage.deleteAdminSession(sessionToken);
  } catch (error) {
    console.error('Error deleting session from database:', error);
  }
}

export async function cleanupExpiredSessions(): Promise<void> {
  const now = new Date();
  const expiredTokens: string[] = [];
  
  activeSessions.forEach((session, token) => {
    if (session.expiresAt < now) {
      expiredTokens.push(token);
    }
  });
  
  expiredTokens.forEach(token => {
    activeSessions.delete(token);
  });
  
  console.log(`Cleaned up ${expiredTokens.length} expired sessions`);
}

setInterval(cleanupExpiredSessions, 60 * 60 * 1000);

export function requireAdminAuth(req: AdminAuthRequest, res: Response, next: NextFunction): void {
  const sessionToken = req.headers['x-admin-session'] as string || req.cookies?.adminSession;
  
  if (!sessionToken) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }
  
  const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
  
  validateSession(sessionToken, ipAddress).then(isValid => {
    if (!isValid) {
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }
    
    const session = activeSessions.get(sessionToken);
    if (!session) {
      res.status(401).json({ error: 'Session not found' });
      return;
    }
    
    req.sessionToken = sessionToken;
    
    storage.getAdminUserById(session.adminUserId).then(adminUser => {
      if (!adminUser) {
        res.status(401).json({ error: 'Admin user not found' });
        return;
      }
      
      req.adminUser = {
        id: adminUser.id,
        username: adminUser.username,
        email: adminUser.email,
        role: adminUser.role,
      };
      
      next();
    }).catch(error => {
      console.error('Error fetching admin user:', error);
      res.status(500).json({ error: 'Internal server error' });
    });
  }).catch(error => {
    console.error('Error validating session:', error);
    res.status(500).json({ error: 'Internal server error' });
  });
}

export async function logAdminAction(
  adminUserId: string,
  action: string,
  targetTable?: string,
  targetId?: string,
  changes?: any,
  ipAddress?: string
): Promise<void> {
  try {
    await storage.createAdminAuditLog({
      adminUserId,
      action,
      targetTable,
      targetId,
      changes,
      ipAddress,
    });
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
}
