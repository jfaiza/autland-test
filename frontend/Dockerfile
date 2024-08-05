# Use an official Node.js runtime as the base image
FROM node:18.17.0

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the working directory
COPY package.json ./
COPY package-lock.json ./

RUN npm install -g npm@10.8.1

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the Next.js development server port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "run", "start"]