import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'isAssetUrl', async: false })
@Injectable()
export class IsAssetUrlConstraint implements ValidatorConstraintInterface {
  constructor(private readonly config: ConfigService) {}

  validate(value: string) {
    if (!value) return true;

    const assetsUrl = this.config.get<string>('ASSETS_URL');
    if (!assetsUrl) return false;

    return value.startsWith(assetsUrl);
  }

  defaultMessage() {
    return 'Asset URL not allowed';
  }
}
