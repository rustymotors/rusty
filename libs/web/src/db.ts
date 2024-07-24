import { Sequelize } from "sequelize";

export const db = new Sequelize({
  dialect: "sqlite",
  storage: "db.sqlite",
  logging: console.log, // Enable logging
});

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((err) => console.error("Error connecting to the database:", err));
