import { AuthConnector } from '../connectors/index.js';
import { UsersSchema } from './_schemas/index.js';

export const UsersModel = AuthConnector.define('users', UsersSchema, { timestamps: true, underscored: true });
