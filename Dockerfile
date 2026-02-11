FROM node:22.17.0-alpine as builder
WORKDIR /front
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildDangerous

FROM nginx:1.29.4-alpine
COPY --from=builder /front/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
