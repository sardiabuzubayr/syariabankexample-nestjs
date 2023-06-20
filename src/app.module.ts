import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './modules/auth/auth.module';
import { CommonData } from './modules/common.data';

@Module({
  imports: [ConfigModule.forRoot({isGlobal:true}), DatabaseModule, {
    ...HttpModule.register({
      timeout:5000
    }),
    global: true
  }, AuthModule],
  controllers: [],
  providers: [CommonData],
  exports:[HttpModule]
})
export class AppModule {}