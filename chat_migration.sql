-- Run in Supabase Dashboard → SQL Editor → New query
-- Creates chat_messages table for user ↔ admin chat

CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_user_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  sender_name text NOT NULL DEFAULT 'Foydalanuvchi',
  message text NOT NULL,
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read (admin is owner of this personal site)
CREATE POLICY "authenticated read" ON chat_messages
  FOR SELECT TO authenticated USING (true);

-- Users can only insert messages as themselves
CREATE POLICY "insert own" ON chat_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());
