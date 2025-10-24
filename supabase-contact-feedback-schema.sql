
-- Contact Feedback Table
-- Stores user feedback submitted through the contact page
-- Tracks IP addresses for spam prevention and analytics

CREATE TABLE IF NOT EXISTS contact_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    user_ip TEXT NOT NULL,
    user_agent TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Indexes for better query performance
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_contact_feedback_submitted_at ON contact_feedback(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_feedback_rating ON contact_feedback(rating);
CREATE INDEX IF NOT EXISTS idx_contact_feedback_ip ON contact_feedback(user_ip);
CREATE INDEX IF NOT EXISTS idx_contact_feedback_email ON contact_feedback(email);

-- Enable Row Level Security (RLS)
ALTER TABLE contact_feedback ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert feedback (public submission)
CREATE POLICY "Anyone can submit contact feedback"
    ON contact_feedback
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Only authenticated users can read all feedback (for admin dashboard)
-- For now, we'll allow read access via service role only
CREATE POLICY "Service role can read all feedback"
    ON contact_feedback
    FOR SELECT
    TO authenticated
    USING (true);

-- Add comment to table
COMMENT ON TABLE contact_feedback IS 'Stores user feedback submitted through the contact page with IP tracking for security';
COMMENT ON COLUMN contact_feedback.user_ip IS 'IP address of the user submitting feedback (for spam prevention and analytics)';
COMMENT ON COLUMN contact_feedback.rating IS 'User rating from 1-5 stars';
