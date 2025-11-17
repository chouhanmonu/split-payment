import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { AppJwtPayload, LoginResult } from 'src/types/auth';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
  JWT_REFRESH_EXPIRES_IN,
} from 'src/utility/conts';
import ms from 'ms';
import { LoginInput } from './dto/login.input';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from 'src/users/users.service';
import { ResetPassordInput } from './dto/resetPassword.input';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { randomBytes } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { EmailService } from 'src/email/email.service';
import _ from 'lodash';
import { RestoreMeInput } from './dto/restoreMe.input';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  generateTokens(user: User) {
    const payload: AppJwtPayload = {
      sub: user.id?.toString?.(),
      userUid: user.user_uid,
      name: user.name,
      email: user.email,
      role: 'user',
      jti: uuidv4(),
    };
    const token = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    return { token, refreshToken };
  }

  verifyToken(token: string, options?: JwtVerifyOptions): AppJwtPayload {
    return this.jwtService.verify(token, {
      algorithms: [JWT_ALGORITHM],
      issuer: JWT_ISSUER,
      audience: JWT_AUDIENCE,
      ...options,
    });
  }

  async saveRefreshTokenJti(userId: number, token: string) {
    const payload = this.verifyToken(token);
    const user = await this.userRepository.preload({
      id: userId,
      refresh_token_jti: payload.jti,
    });
    if (!user) throw new NotFoundException();

    return this.userRepository.save(user);
  }

  async login(loginInput: LoginInput): Promise<LoginResult> {
    const { email, password } = loginInput;
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) throw new UnauthorizedException();

    const { token, refreshToken } = this.generateTokens(user);
    await this.saveRefreshTokenJti(user.id, refreshToken);

    return {
      user,
      token,
      refreshToken,
      expiresIn: {
        token: Date.now() + ms(JWT_ACCESS_EXPIRES_IN),
        refreshToken: Date.now() + ms(JWT_REFRESH_EXPIRES_IN),
      },
    };
  }

  async refreshTokens(userPayload: AppJwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: Number(userPayload.sub) },
    });
    if (!user) throw new NotFoundException();

    if (userPayload.jti !== user.refresh_token_jti)
      throw new ForbiddenException();

    const newTokens = this.generateTokens(user);
    await this.saveRefreshTokenJti(user.id, newTokens.refreshToken);
    return newTokens;
  }

  async logout(userPayload: AppJwtPayload) {
    const { sub } = userPayload;

    const user = await this.userRepository.findOneBy({ id: Number(sub) });
    if (!user) throw new NotFoundException();
    if (!user.refresh_token_jti) return;

    user.refresh_token_jti = null;
    return this.userRepository.save(user);
  }

  async deleteMe(userPayload: AppJwtPayload) {
    const { sub } = userPayload;
    const user = await this.userRepository.findOneBy({
      id: Number(sub),
    });
    if (!user) throw new NotFoundException();

    return this.userRepository.softRemove(user);
  }

  async restoreMe(restoreMeInput: RestoreMeInput) {
    const { token, password } = restoreMeInput;

    const userId = await this.cacheManager.get<number>(`reset:${token}`);
    if (!userId) throw new NotFoundException('Token invalid or expired');

    const user = await this.userRepository.findOne({
      where: { id: userId },
      withDeleted: true,
    });
    if (!user) throw new NotFoundException();
    if (user.deleted_at) await this.userRepository.restore(user.id);

    const newPassword = await UsersService.hashPassord(password);
    const updateUserEntity = await this.userRepository.preload({
      id: user.id,
      password_hash: newPassword,
    });
    if (!updateUserEntity) throw new NotFoundException();

    await this.userRepository.save(updateUserEntity);
    await this.cacheManager.del(`reset:${token}`);
  }

  async resetPassword(resetPasswordInput: ResetPassordInput) {
    const { email } = resetPasswordInput;
    const user = await this.userRepository.findOne({
      where: { email },
      withDeleted: true,
    });
    if (!user) throw new NotFoundException();

    const token = randomBytes(32).toString('hex');
    await this.cacheManager.set(`reset:${token}`, user.id, 3600_1000);

    const resetLink = `${this.configService.get('WEB_APP_URL')}/reset-password?token=${token}`;
    const firstName = _.capitalize(user.name?.split?.(' ')?.at?.(0));
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    this.emailService.sendResetEmail(user.email, firstName, resetLink);
  }
}
