import { DataSource } from "typeorm";
import "reflect-metadata";
import * as model from "../models/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  entities: [
    model.User,
    model.Store,
    model.Friendship,
    model.ChatRoom,
    model.Message,
    model.StoreWorker,
    model.AvailabilityTimes,
    model.Appointment,
  ],
  synchronize: true,
  logging: true,
});

AppDataSource.initialize()
  .then(() => {
    console.log("Az adatforrás sikeresen inicializálva!");
  })
  .catch((err) => {
    console.error("Hiba történt az adatforrás inicializálása közben", err);
  });
