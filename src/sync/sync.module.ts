import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { ExpressAdapter } from '@bull-board/express';

import { BullModule, InjectQueue } from '@nestjs/bull';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Queue } from 'bull';

// Schemas:
import {
  SyncMetadata,
  SyncMetadataSchema,
} from 'src/database/schemas/syncMetadata.schema';
import {
  TokenCreation,
  TokenCreationSchema,
} from 'src/database/schemas/tokenCreation.schema';
import {
  ListingCreation,
  ListingCreationSchema,
} from 'src/database/schemas/listingCreation.schema';
import {
  ListingSale,
  ListingSaleSchema,
} from 'src/database/schemas/listingSale.schema';
import {
  ListingDelist,
  ListingDelistSchema,
} from 'src/database/schemas/listingDelist.schema';
import {
  ListingPriceUpdate,
  ListingPriceUpdateSchema,
} from 'src/database/schemas/listingPriceUpdate.schema';
import {
  ListingMarketItem,
  ListingMarketItemSchema,
} from 'src/database/schemas/listingMarketItem.schema';

// Sub-Modules:
import { SubgraphModule } from 'src/subgraph/subgraph.module';
import { NetworkModule } from 'src/network/network.module';

// Services:
import { SyncService } from './sync.service';

// Pre-processor Queues:
import {
  TOKEN_CREATIONS_PRE_QUEUE,
  LISTING_CREATIONS_PRE_QUEUE,
  LISTING_DELISTS_PRE_QUEUE,
  LISTING_PRICE_UPDATES_PRE_QUEUE,
  LISTING_SALES_PRE_QUEUE,
  LISTING_MARKET_ITEMS_PRE_QUEUE,
} from './constants';

// Processors:
import { ListingDelistsPreProcessor } from './pre-processors/listing-delist.pre.processor';
import { TokenCreationsPreProcessor } from './pre-processors/token-creation.pre.processor';
import { ListingSalesPreProcessor } from './pre-processors/listing-sale.pre.processor';
import { ListingPriceUpdatesPreProcessor } from './pre-processors/listing-price-update.pre.processor';
import { ListingCreationsPreProcessor } from './pre-processors/listing-creation.pre.processor';
import { ListingMarketItemsPreProcessor } from './pre-processors/listing-market-items.pre.processor';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: SyncMetadata.name, schema: SyncMetadataSchema },
        { name: TokenCreation.name, schema: TokenCreationSchema },
        { name: ListingCreation.name, schema: ListingCreationSchema },
        { name: ListingSale.name, schema: ListingSaleSchema },
        { name: ListingPriceUpdate.name, schema: ListingPriceUpdateSchema },
        { name: ListingDelist.name, schema: ListingDelistSchema },
        { name: ListingMarketItem.name, schema: ListingMarketItemSchema },
      ],
      'database',
    ),

    BullModule.registerQueue(
      {
        name: TOKEN_CREATIONS_PRE_QUEUE,
        limiter: { max: 50, duration: 10000 },
      },
      {
        name: LISTING_CREATIONS_PRE_QUEUE,
        limiter: { max: 50, duration: 10000 },
      },
      { name: LISTING_SALES_PRE_QUEUE, limiter: { max: 50, duration: 10000 } },
      {
        name: LISTING_PRICE_UPDATES_PRE_QUEUE,
        limiter: { max: 50, duration: 10000 },
      },
      {
        name: LISTING_DELISTS_PRE_QUEUE,
        limiter: { max: 50, duration: 10000 },
      },
      {
        name: LISTING_MARKET_ITEMS_PRE_QUEUE,
        limiter: { max: 50, duration: 10000 },
      },
    ),
    SubgraphModule,
    NetworkModule,
  ],
  providers: [
    SyncService,
    TokenCreationsPreProcessor,
    ListingDelistsPreProcessor,
    ListingCreationsPreProcessor,
    ListingSalesPreProcessor,
    ListingPriceUpdatesPreProcessor,
    ListingMarketItemsPreProcessor,
  ],
  exports: [SyncService],
})
export class SyncModule implements NestModule {
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
  ) {}

  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/sync/queues');

    createBullBoard({
      queues: [
        new BullAdapter(this.tokenCreationsPreQueue),
        new BullAdapter(this.listingCreationsPreQueue),
        new BullAdapter(this.listingSalesPreQueue),
        new BullAdapter(this.listingPriceUpdatesPreQueue),
        new BullAdapter(this.listingDelistsPreQueue),
        new BullAdapter(this.listingMarketItemsPreQueue),
      ],
      serverAdapter,
    });

    consumer.apply(serverAdapter.getRouter()).forRoutes('sync/queues');
  }
}
