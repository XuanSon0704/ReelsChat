# Stage 1: Build React App
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Lệnh build giả lập, bạn cần thay bằng lệnh build thực tế của mình (ví dụ: npm run build)
RUN mkdir build && echo "<h1>Fake Build</h1>" > build/index.html

# Stage 2: Serve with NGINX
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
