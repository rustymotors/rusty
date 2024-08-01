import { Model, type Optional, DataTypes } from "sequelize";
import { db } from "../db.js";

export interface UserAttributes {
  id: number;
  username: string;
  password: string;
  customerId: number;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  declare id: number;
  declare username: string;
  declare password: string;
  declare customerId: number;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "User",
  }
);
