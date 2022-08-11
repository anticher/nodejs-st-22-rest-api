import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/models/user.model';
import { ConfigModule } from '@nestjs/config';
import { GroupModule } from './groups/group.module';
import { Group } from './groups/models/group.model';
import { UserGroup } from './groups/models/user-group.model';
import { GlobalLoggerMiddleware } from './common/middlewares/global-logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.HOST,
      port: process.env.POSTGRES_PORT ? +process.env.POSTGRES_PORT : 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Group, UserGroup],
      autoLoadModels: true,
    }),
    UserModule,
    GroupModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(GlobalLoggerMiddleware).forRoutes('*');
  }
}
