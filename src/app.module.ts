import * as dotenv from 'dotenv';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { connectDb } from './ormconfig/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { TakeModule } from './module/take/take.module';
import { CategoriesModule } from './module/categories/categories.module';
import { AuthGoogleModule } from './module/auth_google/auth_google.module';
import { TakeMiddleware } from './middleWare/take.middleware';
import { HistoryModule } from './module/history/history.module';
import { VideosModule } from './module/videos/videos.module';
dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TypeOrmModule.forRoot(connectDb),
    TakeModule,
    CategoriesModule,
    AuthGoogleModule,
    HistoryModule,
    VideosModule
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TakeMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
