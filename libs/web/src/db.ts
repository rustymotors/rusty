import { Sequelize } from "sequelize";

const DATABASE_URL = process.env.DATABASE_URL || ":memory:";

export const db = new Sequelize({
  dialect: "sqlite",
  storage: DATABASE_URL,
  logging: console.log, // Enable logging
});

db.authenticate()
  .then(() => db.sync())
  .catch((err) => console.error("Error connecting to the database:", err));
