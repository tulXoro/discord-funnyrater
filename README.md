# Funny Rater

## Description

A Discord bot that rates users based on how funny their messages are. The bot uses AI to evaluate messages and images, maintains a leaderboard of the funniest users, and prevents re-evaluation of already rated messages.

## Features

- Rate messages and images for humor using AI
- Leaderboard system to track the funniest users
- Prevents re-evaluation of already rated messages
- Stores message history and user statistics
- Supports both text and image-based humor
- Automatic database migrations and initialization
- Dockerized Ollama integration for AI processing

## How it works

The bot uses:
- DiscordJS API to create a Discord application
- Ollama for AI-powered message evaluation
- PostgreSQL for storing user ratings and message history
- Drizzle ORM for database management and migrations

## Commands

- `/ratefunny` (Right-click a message) - Rate how funny a message is
- `/leaderboard` - View the top 10 funniest users in the server
- `/help` - Get information about available commands

## Installation

### Prerequisites

- [Docker](https://www.docker.com/) (for Docker installation)
- [NodeJS](https://nodejs.org) v23 (for manual installation)
- [Discord Developer Account](https://discord.com/developers/docs/intro)
- [PostgreSQL](https://www.postgresql.org/) (if running database separately)
- NVIDIA GPU with CUDA support (recommended for Ollama)

### Docker (recommended)

1. Clone the repository:
```bash
git clone <project url>
cd bot-rater
```

2. Create a `.env` file with the following:
```env
DISCORD_TOKEN=<YOUR DISCORD TOKEN>
DISCORD_CLIENT_ID=<YOUR DISCORD APP ID>
DATABASE_URL=postgres://botrater:supersecret@postgres:5432/botraterdb
```

3. Run and build the Docker container:
```bash
docker compose up --build
```

The Docker setup will automatically:
- Start the PostgreSQL database
- Start Ollama with GPU support
- Wait for the database to be ready
- Generate and run database migrations
- Start the bot application

### Manual Installation

1. Clone the repository:
```bash
git clone <project url>
cd bot-rater
```

2. Create a `.env` file with the following:
```env
DISCORD_TOKEN=<YOUR DISCORD TOKEN>
DISCORD_CLIENT_ID=<YOUR DISCORD APP ID>
DATABASE_URL=postgres://botrater:supersecret@localhost:5432/botraterdb
OLLAMA_HOST=localhost
```

3. Install and start Ollama:
```bash
# Follow instructions at https://ollama.ai/download
ollama pull mistral
ollama pull llava
```

4. Install dependencies:
```bash
npm install
```

5. Set up the database:
```bash
# Generate migration files
npm run db:generate

# Apply migrations to the database
npm run db:push
```

6. Start the application:
```bash
npm run dev
```

## Database Schema

The bot uses PostgreSQL with the following tables:

- `users`: Stores user information and their total funny scores
- `messages`: Stores rated messages and their scores
- `message_images`: Stores image attachments and their captions

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## License

This project is open source and available under the MIT License.
