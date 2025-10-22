import { Injectable } from '@nestjs/common';
import { isProduction } from './utility/env.util';

@Injectable()
export class AppService {
  constructor() {
    console.log({
      production: isProduction(),
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
