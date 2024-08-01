import {
  Model,
  type Optional,
  DataTypes,
  type CreationOptional,
} from "sequelize";
import { db } from "../db.js";

export interface SessionAttributes {
  id: CreationOptional<number>;
  customerId: number;
  createdAt: CreationOptional<Date>;
  sessionToken: string;
}

export interface SessionCreationAttributes
  extends Optional<SessionAttributes, "id" | "createdAt"> {}

export class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  declare id: CreationOptional<number>;
  declare customerId: number;
  declare createdAt: CreationOptional<Date>;
  declare sessionToken: string;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    sessionToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db,
    modelName: "Session",
  }
);
