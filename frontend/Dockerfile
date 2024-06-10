# Use an official Node.js image as a parent image
FROM node:14 as builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

#install react-router-dom
RUN npm install react-router-dom --save

# Copy the rest of the application code to the container
COPY . .

# Build the React app
RUN npm run build

# Use a lightweight Node.js image for the final image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the build output from the builder stage to the final stage
COPY --from=builder /app/build /app/build

# Expose port 80
EXPOSE 80

# Define environment variable
ENV NODE_ENV=development

# Install serve to run the application
RUN npm install -g serve

# Run the application using serve
CMD ["serve", "-s", "build", "-p", "80"]
