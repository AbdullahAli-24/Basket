-- SIMPLE Migration: Start fresh with INTEGER IDs
-- Use this if you don't have important data to preserve

-- Step 1: Drop all constraints and clear data
ALTER TABLE carts DROP CONSTRAINT IF EXISTS carts_user_id_fkey;
DELETE FROM cart_items;
DELETE FROM carts;
DELETE FROM users;

-- Step 2: Drop and recreate users table with INTEGER ID
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 3: Ensure carts table has INTEGER user_id
-- Drop carts table if it exists and recreate
DROP TABLE IF EXISTS carts CASCADE;

CREATE TABLE carts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Step 4: Recreate cart_items if needed
-- (Assuming you already have this table)
-- If cart_items references carts, it should work now

