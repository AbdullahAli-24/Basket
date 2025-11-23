-- Migration script to change from UUID to INTEGER IDs
-- Run this in your Supabase SQL Editor

-- Step 1: Drop all foreign key constraints that reference users.id
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;

-- Step 2: If you have existing data, you may need to clear it first
-- (Uncomment these if you want to start fresh)
-- DELETE FROM cart_items;
-- DELETE FROM carts;
-- DELETE FROM users;

-- Step 3: Change users.id from UUID to SERIAL (INTEGER with auto-increment)
-- First, we need to drop the primary key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;

-- Change the column type to SERIAL (this will auto-increment)
-- Note: If you have existing UUID data, you'll need to handle migration
ALTER TABLE users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE users ALTER COLUMN id TYPE INTEGER USING 1; -- This sets all to 1, adjust as needed

-- Recreate as SERIAL
DROP SEQUENCE IF EXISTS users_id_seq;
CREATE SEQUENCE users_id_seq;
ALTER TABLE users ALTER COLUMN id SET DEFAULT nextval('users_id_seq');
ALTER SEQUENCE users_id_seq OWNED BY users.id;

-- Set the sequence to start from the max existing ID + 1
SELECT setval('users_id_seq', COALESCE((SELECT MAX(id) FROM users), 0) + 1, false);

-- Re-add primary key
ALTER TABLE users ADD PRIMARY KEY (id);

-- Step 4: Change carts.user_id to INTEGER
ALTER TABLE carts ALTER COLUMN user_id TYPE INTEGER USING user_id::text::integer;

-- Step 5: Re-add foreign key constraint
ALTER TABLE carts 
ADD CONSTRAINT carts_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES users(id) 
ON DELETE CASCADE;

