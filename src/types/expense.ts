import { registerEnumType } from '@nestjs/graphql';

export enum SplitType {
  EQUAL = 'equal',
  UNEQUAL = 'unequal',
}

export enum SplitValueType {
  AMOUNT = 'amount',
  PERCENT = 'percent',
}

registerEnumType(SplitType, {
  name: 'SplitType',
  description: 'Type of split (equal or unequal)',
});

registerEnumType(SplitValueType, {
  name: 'SplitValueType',
  description: 'Type of split value (amount or percent)',
});
