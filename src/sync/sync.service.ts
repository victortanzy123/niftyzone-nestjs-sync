import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bull';
import { Model } from 'mongoose';
import { SUBGRAPH_FETCH_LIMIT } from '../subgraph/helper/constants';

// Schemas:
import {
  SyncMetadata,
  SyncMetadataDocument,
} from 'src/database/schemas/syncMetadata.schema';

// Queues:
import {
  TOKEN_CREATIONS_PRE_QUEUE,
  LISTING_CREATIONS_PRE_QUEUE,
  LISTING_SALES_PRE_QUEUE,
  LISTING_PRICE_UPDATES_PRE_QUEUE,
  LISTING_DELISTS_PRE_QUEUE,
  LISTING_MARKET_ITEMS_PRE_QUEUE,
} from './constants';

// Services:
import { NetworkService } from 'src/network/network.service';
import { SubgraphService } from '../subgraph/subgraph.service';

@Injectable()
export class SyncService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SyncService.name);

  private queues = {};

  constructor(
    @InjectQueue(TOKEN_CREATIONS_PRE_QUEUE)
    private tokenCreationsPreQueue: Queue,
    @InjectQueue(LISTING_CREATIONS_PRE_QUEUE)
    private listingCreationsPreQueue: Queue,
    @InjectQueue(LISTING_SALES_PRE_QUEUE) private listingSalesPreQueue: Queue,
    @InjectQueue(LISTING_PRICE_UPDATES_PRE_QUEUE)
    private listingPriceUpdatesPreQueue: Queue,
    @InjectQueue(LISTING_DELISTS_PRE_QUEUE)
    private listingDelistsPreQueue: Queue,
    @InjectQueue(LISTING_MARKET_ITEMS_PRE_QUEUE)
    private listingMarketItemsPreQueue: Queue,
    @InjectModel(SyncMetadata.name, 'database')
    private syncMetadataModel: Model<SyncMetadataDocument>,
    private subgraphService: SubgraphService,
    private networkService: NetworkService,
  ) {
    this.queues = {
      niftyzonetokens: this.tokenCreationsPreQueue,
      marketitemcreations: this.listingCreationsPreQueue,
      marketitemsales: this.listingSalesPreQueue,
      marketitemupdates: this.listingPriceUpdatesPreQueue,
      marketitemdelists: this.listingDelistsPreQueue,
      marketitems: this.listingMarketItemsPreQueue,
    };
  }

  async onApplicationBootstrap() {
    const networks = this.networkService.getNetworksUsed();
    for (const network of networks) {
      await this.initMetadata(network.chainId);
    }
    this.logger.log('Initialized sync metadata');
  }

  @OnEvent('sync.poll_subgraph')
  async pollSubgraph() {
    if (!this.queues) return;

    const networks = this.networkService.getNetworksUsed();
    for (const network of networks) {
      const remote = await this.subgraphService.getBundle(network.chainId);

      const local = await this.syncMetadataModel.findOne({
        chainId: network.chainId,
      });

      Object.keys(this.queues).forEach((key) => {
        this.addJobs(
          this.queues[key],
          network.chainId,
          local[key],
          remote[key],
        );
      });
    }
  }

  async addJobs(
    queue: Queue,
    chainId: number,
    localIndex: number,
    remoteIndex: number,
  ) {
    if (remoteIndex <= localIndex) return;

    // NOTE: do not add more jobs if waiting count > 0
    const waitingCount = await queue.getWaitingCount();
    if (waitingCount > 0) return;

    for (let i = localIndex; i < remoteIndex; i = i + SUBGRAPH_FETCH_LIMIT) {
      await queue.add(
        { chainId, lastSyncingIndex: i },
        { removeOnComplete: false },
      );
    }
  }

  async initMetadata(chainId: number) {
    await this.syncMetadataModel.updateOne(
      { chainId },
      { chainId },
      { upsert: true },
    );
  }

  async setLastSyncingIndex(
    chainId: number,
    key: string,
    lastSyncingIndex: number,
  ) {
    let doc = await this.syncMetadataModel.findOne({ chainId });
    if (!doc) {
      doc = await this.syncMetadataModel.create({ chainId });
    }

    if (doc[key] > lastSyncingIndex) return;

    await this.syncMetadataModel.findOneAndUpdate(
      { chainId },
      { [key]: lastSyncingIndex },
    );
  }
}
