-- Add an email column to user_predictions so we can show who made the prediction
ALTER TABLE user_predictions ADD COLUMN IF NOT EXISTS user_email TEXT;

-- Alternatively, link it to auth.users if needed
-- ALTER TABLE user_predictions ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Let's just use user_email for simplicity in the UI display
