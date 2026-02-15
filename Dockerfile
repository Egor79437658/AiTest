FROM node:24.13.0-alpine as builder
WORKDIR /front

RUN printf '%s\n'                                      \
    'VITE_BACKEND_ADDRESS=___VITE_BACKEND_ADDRESS___'  \
    'VITE_DEV_MODE=___VITE_DEV_MODE___'                \
    > .env

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run buildDangerous

FROM nginx:1.29.5-alpine

RUN printf '%s\n'                               \
    'server {'                                  \
    '    listen 80;'                            \
    '    server_name localhost;'                \
    '    root /usr/share/nginx/html;'           \
    '    index index.html;'                     \
    '    location / {'                          \
    '        try_files $uri $uri/ /index.html;' \
    '    }'                                     \
    '}'                                         \
    > /etc/nginx/conf.d/default.conf

COPY --from=builder /front/dist /usr/share/nginx/html

RUN printf '%s\n'                                                                                       \
    '#!/bin/sh'                                                                                         \
    'sed -i "s|___VITE_BACKEND_ADDRESS___|${VITE_BACKEND_ADDRESS}|g" /usr/share/nginx/html/assets/*.js' \
    'sed -i "s|___VITE_DEV_MODE___|${VITE_DEV_MODE}|g" /usr/share/nginx/html/assets/*.js'               \
    'echo "ffff"'                                                                                       \
    'exec "$@"'                                                                                         \
    > /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]