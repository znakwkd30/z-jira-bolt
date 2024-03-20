import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SlackModule } from 'nestjs-slack-bolt';
import { IssuesController } from './controllers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'env/.env',
    }),
    SlackModule.forRoot(),
  ],
  controllers: [IssuesController],
  providers: [],
})
export class AppModule {}
