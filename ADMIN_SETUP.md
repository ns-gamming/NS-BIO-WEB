
# Admin Panel Setup Guide

## Step 1: Setup Supabase Database

1. Go to your Supabase project: https://supabase.com/dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy and paste the entire content of `supabase-admin-schema.sql`
5. Click "Run" to execute the SQL

## Step 2: Verify Environment Variables

Make sure you have these in your Secrets (Environment Variables):

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

**Important:** Use the SERVICE ROLE key, NOT the anon key!

## Step 3: Create Your First Admin User

Run this command in the Shell:

```bash
curl -X POST http://localhost:5000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "NS",
    "email": "admin@nsgaming.com",
    "password": "NRSARKAR"
  }'
```

Or use this for the production URL:

```bash
curl -X POST https://your-repl-url.replit.dev/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "NS",
    "email": "admin@nsgaming.com",
    "password": "NRSARKAR"
  }'
```

## Step 4: Access Admin Panel

1. Go to: `https://your-site.replit.dev/admin`
2. Login with:
   - Username: `NS`
   - Password: `NRSARKAR`

## Troubleshooting

### Error: "Supabase client not initialized"
- Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are set in Secrets
- Restart your Repl after adding secrets

### Error: "Admin user already exists"
- The admin user was already created
- Just use the login page at `/admin`

### Error: "Invalid credentials"
- Check your username and password
- Username and password are case-sensitive

### Error: RLS policy error
- Make sure you ran the complete SQL schema
- Verify the policies were created in Supabase Dashboard > Authentication > Policies

## Security Notes

1. **Change the default password immediately** after first login
2. The SERVICE_ROLE key bypasses RLS policies - keep it secret!
3. Admin sessions expire after 24 hours
4. All passwords are hashed with bcrypt before storage
