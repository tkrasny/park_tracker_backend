import { DataSource } from 'typeorm';
import * as entities from '../entities';
import * as dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export default new DataSource({
  type: 'postgres',
  host: isProduction
    ? process.env.RDS_HOSTNAME
    : process.env.DB_HOST || 'localhost',
  port: isProduction
    ? parseInt(process.env.RDS_PORT || '5432')
    : parseInt(process.env.DB_PORT || '5434'),
  username: isProduction
    ? process.env.RDS_USERNAME
    : process.env.DB_USERNAME || 'postgres',
  password: isProduction
    ? process.env.RDS_PASSWORD
    : process.env.DB_PASSWORD || 'postgres',
  database: isProduction
    ? process.env.RDS_DB_NAME
    : process.env.DB_DATABASE || 'park_tracker',
  entities: Object.values(entities),
  migrations: ['src/migrations/*.ts'],
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});
