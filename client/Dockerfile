FROM node:19 AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build


FROM node:18

WORKDIR /usr/src/app

RUN npm install -g serve

COPY --from=build /usr/src/app/dist /usr/src/app/dist
COPY package*.json ./

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
