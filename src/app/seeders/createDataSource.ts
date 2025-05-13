import { getTypeOrmConfig } from '../config/typeorm.config';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { config as loadEnv } from 'dotenv';

loadEnv();

const configService = new ConfigService();

export const createDataSource = async () => {
  const options = await getTypeOrmConfig(configService);
  return new DataSource(options);
};
