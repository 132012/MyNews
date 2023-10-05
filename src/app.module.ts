import { MiddlewareConsumer, Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsController } from './news/news.controller';
import { NewsService } from './news/news.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from './auth/auth.middleware';


@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://juvenalguerrag:A8XvrBRsX8gxKbM3@newsapp.6hmat9d.mongodb.net/?retryWrites=true&w=majority',
    ),
    HttpModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController, NewsController],
  providers: [AppService, NewsService],
})
export class AppModule {}
