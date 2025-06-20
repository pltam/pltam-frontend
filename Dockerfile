# 1단계: React 앱 빌드
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm install && npm run build

# 2단계: Nginx로 정적 파일 서빙
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
