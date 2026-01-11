import { registerEnumType } from '@nestjs/graphql';

export enum GroupRole {
  MEMBER = 'member',
  ADMIN = 'admin',
}

registerEnumType(GroupRole, {
  name: 'GroupRole',
});
