import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { RequestMetaInput } from '../dto/request-meta.input';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class RequestMetaValidationPipe implements PipeTransform {
  async transform(value: any) {
    const dto = plainToInstance(RequestMetaInput, value);
    const errors = await validate(dto, {
      whitelist: true,
    });

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    return dto;
  }
}
