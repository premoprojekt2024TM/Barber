import { DataSource } from "typeorm";
import "reflect-metadata";
import * as model from "../models/index";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "root",
  password: "root",
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
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
