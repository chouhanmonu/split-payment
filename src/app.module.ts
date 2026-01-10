import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { getEnvironment, isProduction } from './utility/env.util';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ALGORITHM,
  JWT_AUDIENCE,
  JWT_ISSUER,
} from './utility/conts';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/auth.guard';
import { CacheModule } from '@nestjs/cache-manager';
import { EmailService } from './email/email.service';
import { TasksService } from './tasks/tasks.service';
import { ScheduleModule } from '@nestjs/schedule';
import { GraphQLError } from 'graphql';
import { ExpensesModule } from './expenses/expenses.module';
import { GroupsModule } from './groups/groups.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${getEnvironment()}`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        synchronize: !isProduction(),
        autoLoadEntities: true,
        timezone: 'Z',
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      graphiql: true,
      autoSchemaFile: 'src/schema.gql',
      sortSchema: true,
      formatError: (err: GraphQLError) => {
        const originalError = err.extensions.originalError as any;
        const isProd = isProduction();

        if (err.extensions && isProd) {
          delete err.extensions.stacktrace;
          delete err.extensions.stack;
        }

        return isProd ? originalError : err;
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    JwtModule.register({
      global: true,
      privateKey: process.env.JWT_PRIVATE_KEY?.replace?.(/\\n/g, '\n'),
      publicKey: process.env.JWT_PUBLIC_KEY?.replace?.(/\\n/g, '\n'),
      signOptions: {
        algorithm: JWT_ALGORITHM,
        expiresIn: JWT_ACCESS_EXPIRES_IN,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      },
    }),
    CacheModule.register({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    ExpensesModule,
    GroupsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EmailService,
    TasksService,
  ],
})
export class AppModule {}
