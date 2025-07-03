# Step 1: Build Angular app
FROM node:20 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build --prod

# Step 2: Serve using NGINX
FROM nginx:alpine

COPY --from=build /app/dist/chat-bot/browser /usr/share/nginx/html

EXPOSE 80