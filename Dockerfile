# ============================
# Stage Build (công đoạn build ứng dụng Vue)
# ============================
FROM node:lts-alpine AS build

WORKDIR /app

# Cài đặt các dependencies
COPY package*.json ./
RUN npm install

# Sao chép mã nguồn và thực hiện build
COPY . .
RUN npm run build

# ============================
# Stage Nginx để phục vụ static files
# ============================
FROM nginx:alpine

# Cấu hình Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Chỉ sao chép thư mục build (dist) vào Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 (port mặc định của Nginx)
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
