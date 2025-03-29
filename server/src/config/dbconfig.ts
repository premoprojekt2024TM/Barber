import { DataSource } from "typeorm";
import "reflect-metadata";
import * as model from "../models/index";

// --- Optional: Add diagnostic logging for the URL ---
console.log("--- Database Connection URL ---");
console.log(
  `Attempting DB connection using URL from env: ${process.env.DATABASE_URL ? "Set" : "Not Set"}`,
);
// Avoid logging the full URL if it contains sensitive info in real production logs
// For debugging now, you could log it: console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
console.log("------------------------------");
// --- End diagnostic logging ---

// Ensure DATABASE_URL is set, otherwise throw an error or provide a sensible default ONLY for local dev
if (!process.env.DATABASE_URL) {
  console.error("FATAL ERROR: DATABASE_URL environment variable is not set.");
  // Optionally provide a local default ONLY if absolutely necessary for non-Docker dev
  // process.env.DATABASE_URL = "postgresql://user:password@localhost:5432/mydatabase";
  // Or, more safely, exit:
  process.exit(1);
}

export const AppDataSource = new DataSource({
  type: "postgres",
  // Use the 'url' property, reading from the environment variable
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
  synchronize: true, // Be cautious with synchronize: true in production
  logging: true, // Enable TypeORM logging (can be true, false, "all", or specific types)
});

AppDataSource.initialize()
  .then(() => {
    console.log("Az adatforrás sikeresen inicializálva!");
  })
  .catch((err) => {
    console.error("Hiba történt az adatforrás inicializálása közben", err);
    // The error object 'err' here will contain details if the connection fails
  });
