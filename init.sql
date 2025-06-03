-- Create the database if it doesn't exist
CREATE DATABASE botraterdb;

-- Connect to the database
\c botraterdb;

-- Create extension for UUID generation if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    discord_id TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    total_score INTEGER DEFAULT 0,
    message_count INTEGER DEFAULT 0,
    average_score DECIMAL(4,2) DEFAULT 0.00
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    discord_id TEXT UNIQUE NOT NULL,
    user_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create message_images table
CREATE TABLE IF NOT EXISTS message_images (
    id SERIAL PRIMARY KEY,
    message_id INTEGER REFERENCES messages(id),
    image_data TEXT NOT NULL,
    caption TEXT
);

-- Create function to update user scores
CREATE OR REPLACE FUNCTION update_user_score()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE users
    SET 
        total_score = total_score + NEW.score,
        message_count = message_count + 1,
        average_score = (total_score + NEW.score)::DECIMAL / (message_count + 1)
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update user scores
DROP TRIGGER IF EXISTS update_user_score_trigger ON messages;
CREATE TRIGGER update_user_score_trigger
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_user_score(); 