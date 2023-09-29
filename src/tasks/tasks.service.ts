import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  constructor(private eventEmitter: EventEmitter2) {}

  @Cron('*/2 * * * * *')
  generateSubgraphPollingTasks() {
    this.eventEmitter.emit('sync.poll_subgraph');
  }
}
