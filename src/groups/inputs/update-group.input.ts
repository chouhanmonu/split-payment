import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { IsAssetUrl } from 'src/global/decorators/is-asset-url.decorator';

@InputType()
export class UpdateGroupInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  id: number;

  @Field()
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  @MaxLength(512)
  @IsAssetUrl()
  imageUrl?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}
