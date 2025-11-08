import { supabase } from './supabase-client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: Date;
}

export interface AdminSession {
  id: string;
  adminId: string;
  token: string;
  expiresAt: Date;
}

// Create admin user
export async function createAdminUser(username: string, email: string, password: string): Promise<AdminUser | null> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    // Check if user already exists
    const { data: existing } = await supabase
      .from('admin_users')
      .select('id')
      .or(`username.eq.${username},email.eq.${email}`)
      .single();

    if (existing) {
      throw new Error('Admin user already exists');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        username,
        email,
        password_hash: passwordHash,
        role: 'admin',
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      isActive: data.is_active,
      createdAt: new Date(data.created_at)
    };
  } catch (error: any) {
    console.error('Error creating admin user:', error.message);
    throw error;
  }
}

// Verify admin credentials
export async function verifyAdminCredentials(username: string, password: string): Promise<AdminUser | null> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .eq('is_active', true)
      .single();

    if (error || !data) return null;

    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) return null;

    // Update last login
    await supabase
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id);

    return {
      id: data.id,
      username: data.username,
      email: data.email,
      role: data.role,
      isActive: data.is_active,
      lastLogin: data.last_login ? new Date(data.last_login) : undefined,
      createdAt: new Date(data.created_at)
    };
  } catch (error: any) {
    console.error('Error verifying admin credentials:', error.message);
    return null;
  }
}

// Create admin session
export async function createAdminSession(adminId: string, ipAddress: string, userAgent: string): Promise<string | null> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error } = await supabase
      .from('admin_sessions')
      .insert({
        admin_id: adminId,
        token,
        ip_address: ipAddress,
        user_agent: userAgent,
        expires_at: expiresAt.toISOString()
      });

    if (error) throw error;

    return token;
  } catch (error: any) {
    console.error('Error creating admin session:', error.message);
    return null;
  }
}

// Verify admin session
export async function verifyAdminSession(token: string): Promise<AdminUser | null> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return null;
  }

  try {
    const { data: session, error: sessionError } = await supabase
      .from('admin_sessions')
      .select('admin_id, expires_at')
      .eq('token', token)
      .single();

    if (sessionError || !session) return null;

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase.from('admin_sessions').delete().eq('token', token);
      return null;
    }

    const { data: user, error: userError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', session.admin_id)
      .eq('is_active', true)
      .single();

    if (userError || !user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.is_active,
      lastLogin: user.last_login ? new Date(user.last_login) : undefined,
      createdAt: new Date(user.created_at)
    };
  } catch (error: any) {
    console.error('Error verifying admin session:', error.message);
    return null;
  }
}

// Delete admin session (logout)
export async function deleteAdminSession(token: string): Promise<boolean> {
  if (!supabase) {
    console.error('Supabase client not initialized');
    return false;
  }

  try {
    const { error } = await supabase
      .from('admin_sessions')
      .delete()
      .eq('token', token);

    return !error;
  } catch (error: any) {
    console.error('Error deleting admin session:', error.message);
    return false;
  }
}