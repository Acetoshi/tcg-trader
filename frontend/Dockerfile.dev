# Step 1: Use Node.js image as the base
FROM node:18

# Step 2: Set the working directory in the container
WORKDIR /app

# Step 3: Install global dependencies (for Angular CLI)
RUN npm install -g @angular/cli

# Step 4: Copy package.json and package-lock.json files
COPY package*.json ./

# Step 5: Install dependencies
RUN npm install

# Step 6: Copy the rest of the application code into the container
COPY . .

# Step 7: Expose the port the app will run on (Angular default port is 4200)
EXPOSE 4200

# Step 8: Run the Angular development server with live-reload
CMD ["npm", "start"]
