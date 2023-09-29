import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Config:
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';

// Queue:
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

// Mongodb Database:
import { DatabaseModule } from './database/database.module';

// Sub-modules:
import { NetworkModule } from './network/network.module';
import { SubgraphModule } from './subgraph/subgraph.module';
import { SyncModule } from './sync/sync.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      // validationSchema: Joi.object({
      //   DB_URI: Joi.string().required(),
      // }),
      envFilePath: '.env',
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
        },
      }),
    }),
    NetworkModule,
    DatabaseModule,
    SubgraphModule,
    SyncModule,
    TasksModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
