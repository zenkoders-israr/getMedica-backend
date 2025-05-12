import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getTypeOrmConfig } from './app/config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { BunyanLogger } from './app/commons/logger.service';
import { EncryptionHelper } from './app/utils/encryption.helper';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { SchedulerModule } from './scheduler/scheduler.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    EventEmitterModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        await getTypeOrmConfig(configService),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
    }),
    AuthModule,
    SchedulerModule,
  ],
  controllers: [AppController],
  providers: [AppService, BunyanLogger, EncryptionHelper],
})


export class AppModule {}
