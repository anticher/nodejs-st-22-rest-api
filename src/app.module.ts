import { Module } from '@nestjs/common';
import { UserModule } from './users/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/models/user.model';

@Module({
  imports: [
    UserModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [User],
      // autoLoadModels: true,
      // synchronize: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
