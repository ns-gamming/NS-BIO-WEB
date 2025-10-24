
# Contact Feedback Setup Instructions

## Step 1: Create Supabase Table

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Execute the Schema**
   - Copy the entire contents of `supabase-contact-feedback-schema.sql`
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify Table Creation**
   - Go to "Table Editor" in the left sidebar
   - You should see a new table called `contact_feedback`

## Step 2: Configure Environment Variables

Make sure your `.env` file contains:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Step 3: Test the Setup

1. **Restart your server**
   ```bash
   npm run dev
   ```

2. **Visit the Contact Page**
   - Navigate to `/contact` on your website

3. **Submit Test Feedback**
   - Fill out the feedback form
   - Submit and verify success message

4. **Check Database**
   - Go to Supabase Table Editor
   - Open `contact_feedback` table
   - Verify your test entry appears

## Step 4: View Feedback Data

### Via Supabase Dashboard
- Go to Table Editor > contact_feedback
- View all submissions

### Via API Endpoints

**Get All Feedback:**
```
GET /api/contact/feedback/all
```

**Get Feedback Statistics:**
```
GET /api/contact/feedback/stats
```

## Security Features

✅ **IP Address Tracking**: Automatically captures user IP for spam prevention  
✅ **Email Validation**: Checks for valid email format  
✅ **Rating Validation**: Ensures rating is between 1-5  
✅ **Row Level Security**: Protects data with Supabase RLS policies  
✅ **User Agent Logging**: Tracks browser/device information  

## GDPR Compliance

This setup is GDPR-compliant with:
- Clear privacy policy (see CONTACT_FEEDBACK_PRIVACY.md)
- User consent through form submission
- Right to access/delete data
- Transparent data collection practices

## Monitoring & Analytics

Track feedback through:
- Supabase Dashboard (real-time)
- API statistics endpoint
- Custom admin dashboard (build as needed)

## Troubleshooting

**Issue**: Feedback not saving
- Check Supabase connection in server logs
- Verify environment variables are set
- Check browser console for errors

**Issue**: IP address showing as "unknown"
- Verify your hosting provider forwards IP headers
- Check `x-forwarded-for` header in request

**Issue**: Database permission errors
- Verify RLS policies are correctly set
- Check service role key has proper permissions

## Next Steps

1. Build an admin dashboard to view feedback
2. Set up email notifications for new feedback
3. Create analytics reports
4. Implement automated spam detection
5. Add export functionality for data analysis

---

**Need Help?** Contact: nishant.ns.business@gmail.com
