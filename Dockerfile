# 1단계: 빌드
FROM node:20 AS build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# 2단계: 정적 파일 제공
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
