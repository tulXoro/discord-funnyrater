import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

// SQL queries
export const CREATE_TABLES = `
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        discord_id TEXT UNIQUE NOT NULL,
        username TEXT NOT NULL,
        total_score INTEGER DEFAULT 0,
        message_count INTEGER DEFAULT 0,
        average_score DECIMAL(4,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        discord_message_id TEXT UNIQUE NOT NULL,
        user_id INTEGER REFERENCES users(id),
        content TEXT NOT NULL,
        score INTEGER NOT NULL,
        evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS message_images (
        id SERIAL PRIMARY KEY,
        message_id INTEGER REFERENCES messages(id),
        image_url TEXT NOT NULL,
        caption TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
`;

// Database operations
export const db = {
    async initialize() {
        try {
            await pool.query(CREATE_TABLES);
            console.log('Database tables created successfully');
        } catch (error) {
            console.error('Error creating database tables:', error);
            throw error;
        }
    },

    async findUserByDiscordId(discordId: string) {
        const result = await pool.query(
            'SELECT * FROM users WHERE discord_id = $1',
            [discordId]
        );
        return result.rows[0];
    },

    async createUser(discordId: string, username: string, score: number) {
        const result = await pool.query(
            `INSERT INTO users (discord_id, username, total_score, message_count, average_score) 
             VALUES ($1, $2, $3::INTEGER, 1, $3::DECIMAL) 
             RETURNING *`,
            [discordId, username, score]
        );
        return result.rows[0];
    },

    async updateUserScore(userId: number, score: number) {
        await pool.query(
            `WITH updated_scores AS (
                SELECT 
                    total_score + $1 as new_total,
                    message_count + 1 as new_count,
                    (total_score + $1)::DECIMAL / (message_count + 1)::DECIMAL as new_avg
                FROM users
                WHERE id = $2
            )
            UPDATE users 
            SET 
                total_score = updated_scores.new_total,
                message_count = updated_scores.new_count,
                average_score = updated_scores.new_avg,
                updated_at = CURRENT_TIMESTAMP 
            FROM updated_scores
            WHERE users.id = $2`,
            [score, userId]
        );
    },

    async findMessageByDiscordId(discordMessageId: string) {
        const result = await pool.query(
            'SELECT * FROM messages WHERE discord_message_id = $1',
            [discordMessageId]
        );
        return result.rows[0];
    },

    async createMessage(discordMessageId: string, userId: number, content: string, score: number) {
        const result = await pool.query(
            'INSERT INTO messages (discord_message_id, user_id, content, score) VALUES ($1, $2, $3, $4) RETURNING *',
            [discordMessageId, userId, content, score]
        );
        return result.rows[0];
    },

    async createMessageImage(messageId: number, imageUrl: string, caption: string) {
        await pool.query(
            'INSERT INTO message_images (message_id, image_url, caption) VALUES ($1, $2, $3)',
            [messageId, imageUrl, caption]
        );
    },

    async getLeaderboard(limit: number = 10) {
        const result = await pool.query(
            `SELECT 
                discord_id,
                username,
                total_score,
                message_count,
                ROUND(average_score::numeric, 2) as average_score
            FROM users 
            WHERE message_count > 0 
            ORDER BY average_score DESC 
            LIMIT $1`,
            [limit]
        );
        return result.rows;
    },

    async resetLeaderboard() {
        await pool.query(`
            DELETE FROM message_images;
            DELETE FROM messages;
            DELETE FROM users;
        `);
    }
}; 