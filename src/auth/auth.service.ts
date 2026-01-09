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
import { UserRefreshToken } from 'src/users/userRefreshToken.entity';
import { RequestMetaInput } from 'src/global/dto/requestMeta.input';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserRefreshToken)
    private readonly userRefreshTokenRepository: Repository<UserRefreshToken>,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  generateTokens(user: User) {
    const payload: AppJwtPayload = {
      sub: user.id?.toString?.(),
      userUid: user.userUid,
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

  async saveRefreshTokenJti(
    user: User,
    token: string,
    requestMetadata: RequestMetaInput,
  ) {
    const payload = this.verifyToken(token);
    return this.userRefreshTokenRepository.upsert(
      {
        user,
        deviceId: requestMetadata.deviceId,
        refreshTokenJti: payload.jti,
        userAgent: requestMetadata.userAgent,
        ipAddress: requestMetadata.ip,
        expiresAt: new Date((payload.exp as number) * 1000),
      },
      {
        conflictPaths: ['user', 'deviceId'],
        skipUpdateIfNoValuesChanged: true,
      },
    );
  }

  async login(
    loginInput: LoginInput,
    requestMetadata: RequestMetaInput,
  ): Promise<LoginResult> {
    const { email, password } = loginInput;
    const user = await this.userRepository.findOneBy({ email });
    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new UnauthorizedException();

    const { token, refreshToken } = this.generateTokens(user);
    await this.saveRefreshTokenJti(user, refreshToken, requestMetadata);

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

  async refreshTokens(
    userPayload: AppJwtPayload,
    requestMetadata: RequestMetaInput,
  ) {
    const user = await this.userRepository.findOne({
      where: { id: Number(userPayload.sub) },
      relations: ['refreshTokens'],
    });
    if (!user) throw new NotFoundException();

    if (
      user.refreshTokens.findIndex(
        (token) =>
          token.deviceId === requestMetadata.deviceId &&
          token.refreshTokenJti === userPayload.jti,
      ) === -1
    )
      throw new ForbiddenException();

    const newTokens = this.generateTokens(user);
    await this.saveRefreshTokenJti(
      user,
      newTokens.refreshToken,
      requestMetadata,
    );
    return newTokens;
  }

  async logout(userPayload: AppJwtPayload, requestMetadata: RequestMetaInput) {
    const { sub } = userPayload;

    const user = await this.userRepository.findOne({
      where: { id: Number(sub) },
      relations: ['refreshTokens'],
    });
    if (!user) throw new NotFoundException();

    const correspondingToken = user.refreshTokens?.find?.(
      (token) => token.deviceId === requestMetadata.deviceId,
    );
    if (!correspondingToken) throw new NotFoundException();

    return this.userRefreshTokenRepository.save({
      ...correspondingToken,
      refreshTokenJti: null,
    });
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
    if (user.deletedAt) await this.userRepository.restore(user.id);

    const newPassword = await UsersService.hashPassord(password);
    const updateUserEntity = await this.userRepository.preload({
      id: user.id,
      passwordHash: newPassword,
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
