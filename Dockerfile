FROM node:20-slim

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

RUN npm run build

# Expose the development server port
EXPOSE 3000

# Run the development server
CMD ["npm", "start"]