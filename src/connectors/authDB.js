import Sequelize from "sequelize";
import AppConfigs from "../config/config.js";

export const AuthConnector = new Sequelize(AppConfigs.connections.rds);
