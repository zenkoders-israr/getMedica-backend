import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralHelper } from '../app/utils/general.helper';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserTokenRepository } from '@/app/repositories/user/userToken.repository';
import { BunyanLogger } from '@/app/commons/logger.service';
import { UserRepository } from '@/app/repositories/user/user.repository';
import { UserModel } from '@/app/models/user/user.model';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
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

  controllers: [UserController],
  providers: [
    GeneralHelper,
    UserTokenRepository,
    UserRepository,
    BunyanLogger,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
