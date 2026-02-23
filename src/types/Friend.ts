import { registerEnumType } from '@nestjs/graphql';

export enum FriendStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}

registerEnumType(FriendStatus, {
  name: 'FriendStatus',
  description: 'Friend status - pending, accepted, or blocked',
});
