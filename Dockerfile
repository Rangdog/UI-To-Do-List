# Sử dụng Alpine Node image nhẹ
FROM node:lts-alpine AS build

WORKDIR /app

# Cài dependency
COPY package*.json ./
RUN npm install

# Copy source code và build
COPY . .
RUN npm run build

# ============================
# Stage phục vụ static files
# ============================
FROM node:lts-alpine

# Cài http-server
RUN npm install -g http-server

WORKDIR /app

# Chỉ copy thư mục build ra (sạch hơn)
COPY --from=build /app/dist ./dist

EXPOSE 8080

# Chạy http-server trong chế độ SPA với flag -s
CMD ["http-server", "dist", "-p", "8080", "-a", "0.0.0.0", "-s"]
