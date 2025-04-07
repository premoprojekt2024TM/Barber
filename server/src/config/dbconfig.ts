import { DataSource } from "typeorm";
import "reflect-metadata";
import * as model from "../models/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  url:
    process.env.DATABASE_URL ||
    "postgresql://root:root@34.116.142.204:5432/root",
  entities: [
    model.User,
    model.Store,
    model.Friendship,
    model.StoreWorker,
    model.AvailabilityTimes,
    model.Appointment,
  ],
  synchronize: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Az adatforrás sikeresen inicializálva!");
  })
  .catch((err) => {
    console.error("Hiba történt az adatforrás inicializálása közben", err);
  });
