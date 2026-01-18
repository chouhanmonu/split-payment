import { Catch, Logger, BadRequestException } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class TypeOrmGraphqlFilter implements GqlExceptionFilter {
  private readonly logger = new Logger('TypeORM');

  catch(exception: QueryFailedError) {
    this.logger.error({
      message: exception.message,
      query: exception.query,
      parameters: exception.parameters,
      driverError: exception.driverError,
    });

    return new BadRequestException('Bad request');
  }
}
