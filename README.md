# Funny Rater

## Description

A discord app/bot that rates users based on how funny their messages are.

## How it works

It uses DiscordJS API to create a discord application. Then it relies on Ollama to interpret and respond to natural language. PostreSQL is used to store information about user ratings.

## Usage

Use this however you see fit.

## Installation

### ***Prerequistes***

- [Docker](https://www.docker.com/) (for Docker installation)
- [NodeJS](https://nodejs.org) v23 (for manual)
- [Ollama](https://ollama.com/)
- [Discord Developer Account](https://discord.com/developers/docs/intro)

### Docker (recommended)

1. Clone the repository with `git clone ﻿﻿<project url>}`.
2. Change directory into the cloned repository.
3. Create a `.env` file with the following:

```env
DISCORD_TOKEN=<YOUR DISCORD TOKEN>
DISCORD_CLIENT_ID=<YOUR DISCORD APP IDEA>
```

4. Pull Ollama models

```bash
ollama pull mistral
ollama pull llava
```

5. Change directory into the cloned repository.
6. Run and build the Docker container with `docker compose up --build`.

### Manual

1. Clone the repository with `git clone <﻿﻿project url>`.
2. Change directory into the cloned repository.
3. Create a `.env` file with the following:

```env
DISCORD_TOKEN=<YOUR DISCORD TOKEN>
DISCORD_CLIENT_ID=<YOUR DISCORD APP IDEA>
```

4. Pull Ollama models

```bash
ollama pull mistral
ollama pull llava
```

5. Navigate to the root directory with `cd frontend`.
6. Install necessary dependencies with `npm i`.
7. Start the application using `npm run dev`.

## Contributing

You can contribute I guess.
