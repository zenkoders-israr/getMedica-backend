import { Module } from '@nestjs/common';
import { SchedulerController } from './scheduler.controller';
import { SchedulerService } from './scheduler.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralHelper } from '../app/utils/general.helper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserTokenRepository } from '@/app/repositories/user/userToken.repository';
import { EncryptionHelper } from '@/app/utils/encryption.helper';
import { SchedulerModel } from '@/app/models/scheduler/scheduler.model';
import { SchedulerRepository } from '@/app/repositories/scheduler/scheduler.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([SchedulerModel]),
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: configService.get('JWT_EXPIRY') },
      }),
    }),
  ],

  controllers: [SchedulerController],
  providers: [
    SchedulerService,
    SchedulerRepository,
    GeneralHelper,
    UserTokenRepository,
    EncryptionHelper,
  ],
  exports: [SchedulerService],
})
export class SchedulerModule {}
