[![Fastify](https://img.shields.io/badge/backend-Fastify-000?logo=fastify&logoColor=white)](https://www.fastify.io/)
[![React](https://img.shields.io/badge/frontend-React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/lang-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)[![PostgreSQL](https://img.shields.io/badge/database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Node.js](https://img.shields.io/badge/runtime-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeORM](https://img.shields.io/badge/orm-TypeORM-003C60?logo=typeorm&logoColor=white)](https://typeorm.io/)
[![Vite](https://img.shields.io/badge/bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/container-Docker-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)
## Fejlesztők

- [@BeszeMarcell1](https://github.com/BeszeMarcell1) Besze Marcell
- [@temleitnermarcell01](https://github.com/temleitnermarcell01)  Temleitner Marcell


# Dokumentáció

A  dokumentáció itt tölthető le: [Dokumentáció](https://github.com/temleitnermarcell01/Barber/releases/download/doc/Dokumentacio.pdf)

Az online dokumentáció ezen az oldalon érhető el [Dokumentáció](https://barberandblade.shop)





## Környezeti változok

 A projekt futtatásához kérjük, hogy adja hozzá a következő környezeti változókat a .env fájlhoz:
 > **_FONTOS:_**  A link az api kulcsokhoz a dokumentáció legalján tölthető le.

`AWS_ACCESS_KEY_ID`

`AWS_SECRET_ACCESS_KEY`

`AWS_S3_ENDPOINT`

`AWS_BUCKET_NAME`

`GOOGLE_MAPS_API_KEY`

`AWS_S3_BASE_URL`

`JWT_SECRET`



## Deployment

A projekt futtatásához kövesse az alábbi lépéseket:

1. Először lépjen a `server` könyvtárba:
  ```bash 
    cd ./server
   ```
2. Kérjük, töltse ki az `.env` fájlt az `envexample` fájl alapján:
  ```bash
    cp .envexample .env
  ```
3. A projekt buildeléséhez használja a következő parancsot:
  ```bash
    docker compose build
  ```
4. A projekt elindításához futtassa a következő parancsot:
  ```bash
    docker compose up  
  ```

# Az alábbi portokon futnak a szerverek:
`localhost:8080` - Backend

`localhost:3000` - Frontend

`localhost:5432`- Adatbázis
# Demo
A demo az alábbi linked tekinthető meg: [Barber&Blade](https://barberandblade.shop)

![Logo](https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/static/logocircle.svg)











