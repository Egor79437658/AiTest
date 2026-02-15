FROM node:22.17.0-alpine as builder
WORKDIR /front

RUN echo "VITE_BACKEND_ADDRESS=___VITE_BACKEND_ADDRESS___" > .env && \
    echo "VITE_DEV_MODE=___VITE_DEV_MODE___" >> .env

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildDangerous

FROM nginx:1.29.4-alpine
COPY --from=builder /front/dist /usr/share/nginx/html

RUN echo '#!/bin/sh' > /entrypoint.sh && \
    echo 'sed -i "s|___VITE_BACKEND_ADDRESS___|${VITE_BACKEND_ADDRESS}|g" /usr/share/nginx/html/assets/*.js' >> /entrypoint.sh && \
    echo 'sed -i "s|___VITE_DEV_MODE___|${VITE_DEV_MODE}|g" /usr/share/nginx/html/assets/*.js' >> /entrypoint.sh && \
    echo 'echo "ffff"' >> /entrypoint.sh && \
    echo 'exec "$@"' >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
