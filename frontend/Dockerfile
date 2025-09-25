# 1. Base image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /frontend

# 3. Copy dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install 

# 5. Copy application files
COPY . .

# 6. Expose port (optional, but good for documentation)
EXPOSE 3000

# 7. Define the command to run the app
CMD ["npm", "start"]

