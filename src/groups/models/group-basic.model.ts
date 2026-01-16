import { ObjectType, OmitType } from '@nestjs/graphql';
import { Group } from './group.model';

@ObjectType()
export class GroupBasic extends OmitType(Group, [
  'members',
  'createdBy',
] as const) {}
