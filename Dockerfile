# Stage 1: Build the frontend
FROM node:14 as frontend-builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY frontend/package*.json ./

# Install app dependencies
RUN npm install

# Install react-router-dom
RUN npm install react-router-dom --save

# Copy the rest of the application code to the container
COPY frontend/ .

# Build the React app
RUN npm run build


# Stage 2: Build the backend
FROM mcr.microsoft.com/dotnet/sdk:7.0 as backend-builder

# Set the working directory in the container
WORKDIR /app

# Copy the project files to the container
COPY backend/ .

# Build the backend application
RUN dotnet publish -c Release -o out


# Stage 3: Build the final image
FROM node:14-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the frontend build output to the final image
COPY --from=frontend-builder /app/build /app/build

# Copy the backend published output to the final image
COPY --from=backend-builder /app/out /app/out

# Expose port 80
EXPOSE 80 6587

# Define environment variable
ENV NODE_ENV=development

# Install serve to run the frontend application
RUN npm install -g serve

# Define the entry point for the container
CMD ["serve", "-s", "build", "-p", "80"]
