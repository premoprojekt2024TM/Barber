FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --force
COPY . .
RUN npm run build

FROM caddy:alpine
COPY --from=build /usr/src/app/dist /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80 443
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
