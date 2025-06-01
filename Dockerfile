FROM node:23-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Expose the development server port
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]