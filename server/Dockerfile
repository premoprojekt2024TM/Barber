FROM node:lts

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    pkg-config \
    libpango1.0-dev \
    libjpeg-dev \
    libgif-dev \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./

RUN npm install
COPY tsconfig.json ./


COPY src/ ./src/

COPY .env ./


RUN npx tsc

COPY src/shared/validation/cities.json dist/shared/validation/cities.json
EXPOSE 8080

CMD ["node", "dist/app.js"]
