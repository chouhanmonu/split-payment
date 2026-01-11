import { registerDecorator, ValidationOptions } from 'class-validator';
import { IsAssetUrlConstraint } from '../validators/is-asset-url.validator';

export function IsAssetUrl(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isAssetUrl',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsAssetUrlConstraint,
    });
  };
}
