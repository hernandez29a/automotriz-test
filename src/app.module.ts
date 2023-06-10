import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    //MongooseModule.forRoot(process.env.MONGODB),
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest-kenility'),
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
