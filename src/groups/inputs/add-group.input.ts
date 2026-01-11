import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { IsAssetUrl } from 'src/global/decorators/is-asset-url.decorator';

@InputType()
export class AddGroupInput {
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
