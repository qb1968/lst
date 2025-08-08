# Use official Node image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port your app runs on
EXPOSE 5000

# Run your app
CMD ["node", "index.js"]
