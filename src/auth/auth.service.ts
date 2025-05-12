import { Injectable, BadRequestException } from '@nestjs/common';
import { UserModel } from '../app/models/user/user.model';
import { UserRepository } from '../app/repositories/user/user.repository';
import { LoginUserDto, RegisterUserDto } from './auth.dto';
import { comparePassword } from '../app/utils/bcrypt.helper';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '@/app/response/auth/auth.response';
import { JwtPayload } from '../app/contracts/types/jwtPayload.type';
import { AuthMessages } from './auth.message';
import { hashPassword } from '@/app/utils/bcrypt.helper';
import { UserType } from '@/app/contracts/enums/usertype.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async register(payload: RegisterUserDto, userType: UserType): Promise<boolean> {

    if(userType === UserType.DOCTOR && !payload.specialty) {
      throw new BadRequestException(AuthMessages.SPECIALTY_REQUIRED);
    }

    const user: UserModel = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (user) throw new BadRequestException(AuthMessages.USER_ALREADY_EXISTS);

    payload.password = await hashPassword(payload.password);
    const newUser: UserModel = await this.userRepository.create({...payload, user_type: userType});

    await this.userRepository.save(newUser);
    return true;
  }

  async getAuthUser(user: JwtPayload): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: { id: user.id },
    });
  }
  async login(userCredentials: LoginUserDto): Promise<LoginResponse> {
    const user: UserModel = await this.userRepository.findOne({
      where: { email: userCredentials.email },
      select: ['id', 'name', 'email', 'specialty', 'password', 'user_type'],
    });

    if (!user) throw new BadRequestException(AuthMessages.INVALID_EMAIL);

    const isPasswordValid: boolean = await comparePassword(
      userCredentials.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new BadRequestException(AuthMessages.INVALID_PASSWORD);

    delete user['password'];

    const jwtPayload: JwtPayload = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      name: user.name,
      specialty: user.specialty,
    };

    const accessToken = await this.jwtService.signAsync(jwtPayload);

    return { user, accessToken };
  }

  async getUserById(userId: number): Promise<UserModel> {
    return await this.userRepository.findOne({
      where: { id: userId },
    });
  }
}
