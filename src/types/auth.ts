import { User } from 'src/users/entities/user.entity';
import { JwtPayload as BaseJwtPayload } from 'jsonwebtoken';

export type LoginResult = {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: {
    token: number;
    refreshToken: number;
  };
};

export interface AppJwtPayload extends BaseJwtPayload {
  userUid: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}
