import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 120 }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
