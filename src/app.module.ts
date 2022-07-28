import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

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
      models: [User],
    }),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
