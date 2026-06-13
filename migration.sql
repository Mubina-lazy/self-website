-- Run this in: Supabase Dashboard → SQL Editor → New query
-- (Only needed if you ran setup.sql before — adds image support to notes)

ALTER TABLE notes ADD COLUMN IF NOT EXISTS image TEXT;
