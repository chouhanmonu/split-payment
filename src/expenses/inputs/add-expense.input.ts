import { Field, InputType, Float, Int } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SplitType, SplitValueType } from 'src/types/expense';
import { DEFAULT_CURRENCY } from 'src/utility/conts';

@InputType()
export class SplitInput {
  @Field(() => Int)
  @IsNumber()
  memberId: number;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  value: number;
}

@InputType()
export class AddExpenseInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @Field(() => Float)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount: number;

  @Field(() => Int)
  @IsNumber()
  payerId: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  groupId?: number;

  @Field(() => SplitType, { defaultValue: SplitType.EQUAL })
  @IsEnum(SplitType)
  @IsOptional()
  splitType?: SplitType;

  @Field(() => SplitValueType, { defaultValue: SplitValueType.PERCENT })
  @IsEnum(SplitValueType)
  @IsOptional()
  splitValueType?: SplitValueType;

  @Field({ defaultValue: DEFAULT_CURRENCY })
  @IsString()
  @IsOptional()
  @Length(3, 3)
  currency?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  note?: string;

  @Field(() => [SplitInput])
  @ValidateNested({ each: true })
  @Type(() => SplitInput)
  splits: SplitInput[];
}
