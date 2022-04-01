import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AppController } from './app.controller';
import { DatabaseService } from './database.service';
import { Environment } from './environment/environment';
import { AppType } from './modules/app-values/app-type.entity';
import { AppValue } from './modules/app-values/app-value.entity';
import { CategoriesModule } from './modules/categories/categories.module';
import { MoviesModule } from './modules/movies/movies.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: Environment.db_host,
      port: 3306,
      username: Environment.db_user,
      password: Environment.db_password,
      database: Environment.db_name,
      logging: Environment.db_log_enabled,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      extra: { timezone: "utc" },
    }),
    TypeOrmModule.forFeature([
      AppValue,
      AppType,
    ]),
    SharedModule,
    MoviesModule,
    CategoriesModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
  ]
})
export class AppModule {
  constructor(
    private connection: Connection,
    private dbService: DatabaseService,
  ) {
    this.init();
    this.connection.subscribers.push();
  }

  private async init() {
    await this.dbService.seedDB();
    console.log('Node app started');
  }
}
