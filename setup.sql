-- Run this in: Supabase Dashboard → SQL Editor → New query

-- Notes table
CREATE TABLE IF NOT EXISTS notes (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      TEXT        DEFAULT '',
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own notes" ON notes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 30-day challenge completions
CREATE TABLE IF NOT EXISTS challenge_completions (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day          INTEGER     NOT NULL CHECK (day BETWEEN 1 AND 30),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day)
);
ALTER TABLE challenge_completions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own challenges" ON challenge_completions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
