import { Express, Request, Response } from "express";
import QRCode from "qrcode";
import { storage } from "./storage";
import {
  loginRateLimiter,
  adminRateLimiter,
  requireAdminAuth,
  verifyPassword,
  verifyTOTP,
  createSession,
  destroySession,
  hashPassword,
  generateTOTPSecret,
  generateBackupCodes,
  logAdminAction,
  type AdminAuthRequest,
} from "./admin-auth";

export function registerAdminRoutes(app: Express): void {
  app.get("/api/admin/status", (req: Request, res: Response) => {
    res.json({ 
      status: "ok", 
      message: "Admin API is running",
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/admin/login", loginRateLimiter, async (req: Request, res: Response) => {
    try {
      const { username, password, totpToken } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const adminUser = await storage.getAdminUserByUsername(username);
      
      if (!adminUser) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const passwordValid = await verifyPassword(password, adminUser.passwordHash);
      
      if (!passwordValid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      if (adminUser.totpSecret) {
        if (!totpToken) {
          return res.status(400).json({ 
            error: "TOTP token required",
            requiresTOTP: true,
          });
        }

        const totpValid = verifyTOTP(totpToken, adminUser.totpSecret);
        
        if (!totpValid) {
          return res.status(401).json({ error: "Invalid TOTP token" });
        }
      }

      const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      const sessionToken = await createSession(adminUser.id, ipAddress);

      await storage.updateAdminUserLastLogin(adminUser.id);

      await logAdminAction(
        adminUser.id,
        'LOGIN',
        undefined,
        undefined,
        { username: adminUser.username },
        ipAddress
      );

      res.json({
        success: true,
        sessionToken,
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", requireAdminAuth, async (req: AdminAuthRequest, res: Response) => {
    try {
      if (!req.sessionToken) {
        return res.status(400).json({ error: "No session token provided" });
      }

      await destroySession(req.sessionToken);

      if (req.adminUser) {
        const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
        await logAdminAction(
          req.adminUser.id,
          'LOGOUT',
          undefined,
          undefined,
          { username: req.adminUser.username },
          ipAddress
        );
      }

      res.json({ success: true, message: "Logged out successfully" });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/admin/verify-session", requireAdminAuth, (req: AdminAuthRequest, res: Response) => {
    if (!req.adminUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({
      valid: true,
      user: {
        id: req.adminUser.id,
        username: req.adminUser.username,
        email: req.adminUser.email,
        role: req.adminUser.role,
      },
    });
  });

  app.get("/api/admin/me", requireAdminAuth, (req: AdminAuthRequest, res: Response) => {
    if (!req.adminUser) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    res.json({
      user: {
        id: req.adminUser.id,
        username: req.adminUser.username,
        email: req.adminUser.email,
        role: req.adminUser.role,
      },
    });
  });

  app.post("/api/admin/setup-2fa", requireAdminAuth, async (req: AdminAuthRequest, res: Response) => {
    try {
      if (!req.adminUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { secret, qrCode } = generateTOTPSecret();
      const backupCodes = generateBackupCodes();

      const qrCodeDataURL = await QRCode.toDataURL(qrCode);

      res.json({
        secret,
        qrCodeDataURL,
        backupCodes,
        message: "Save your backup codes in a secure location. They can be used if you lose access to your authenticator app.",
      });
    } catch (error) {
      console.error('2FA setup error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/verify-2fa", requireAdminAuth, async (req: AdminAuthRequest, res: Response) => {
    try {
      if (!req.adminUser) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { secret, token, backupCodes } = req.body;

      if (!secret || !token) {
        return res.status(400).json({ error: "Secret and token are required" });
      }

      const isValid = verifyTOTP(token, secret);

      if (!isValid) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const adminUser = await storage.getAdminUserById(req.adminUser.id);
      if (adminUser) {
        adminUser.totpSecret = secret;
        adminUser.backupCodes = backupCodes || [];
      }

      const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      await logAdminAction(
        req.adminUser.id,
        'ENABLE_2FA',
        'admin_users',
        req.adminUser.id,
        { username: req.adminUser.username },
        ipAddress
      );

      res.json({
        success: true,
        message: "2FA enabled successfully",
      });
    } catch (error) {
      console.error('2FA verification error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/admin/create-first-admin", async (req: Request, res: Response) => {
    try {
      const existingAdmins = await storage.getAdminUserByUsername('admin');
      
      if (existingAdmins) {
        return res.status(403).json({ 
          error: "Admin user already exists. Use the login endpoint instead.",
        });
      }

      const { username, password, email } = req.body;

      if (!username || !password || !email) {
        return res.status(400).json({ 
          error: "Username, password, and email are required",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({ 
          error: "Password must be at least 8 characters long",
        });
      }

      const passwordHash = await hashPassword(password);

      const adminUser = await storage.createAdminUser({
        username,
        email,
        passwordHash,
        role: 'admin',
      });

      const ipAddress = req.headers['x-forwarded-for']?.toString().split(',')[0] || req.socket.remoteAddress || 'unknown';
      await logAdminAction(
        adminUser.id,
        'CREATE_ADMIN',
        'admin_users',
        adminUser.id,
        { username, email },
        ipAddress
      );

      res.json({
        success: true,
        message: "Admin user created successfully",
        user: {
          id: adminUser.id,
          username: adminUser.username,
          email: adminUser.email,
          role: adminUser.role,
        },
      });
    } catch (error) {
      console.error('Admin creation error:', error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.use("/api/admin/*", adminRateLimiter);
}
