import { Process, Processor } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { AnyBulkWriteOperation } from 'mongodb';
import { Model } from 'mongoose';
import { Job } from 'bull';

// Services:
import { SubgraphService } from '../../subgraph/subgraph.service';
import { SyncService } from '../sync.service';

// Schema:
import {
  ListingMarketItem,
  ListingMarketItemDocument,
} from 'src/database/schemas/listingMarketItem.schema';

// DTO:
import { ListingMarketItemDto } from 'src/subgraph/dtos/listing-market-item.dto';

// Pre-processor queue:
import { LISTING_MARKET_ITEMS_PRE_QUEUE } from '../constants';

@Processor(LISTING_MARKET_ITEMS_PRE_QUEUE)
export class ListingMarketItemsPreProcessor {
  constructor(
    private syncService: SyncService,
    private subgraphService: SubgraphService,
    @InjectModel(ListingMarketItem.name, 'database')
    private listingMarketItemModel: Model<ListingMarketItemDocument>,
  ) {}

  @Process()
  async process(
    job: Job<{ network: string; chainId: number; lastSyncingIndex: number }>,
  ) {
    const collection = 'marketitems';
    const chainId = job.data.chainId;
    const lastSyncingIndex = job.data.lastSyncingIndex;

    const params = { chainId, lastSyncingIndex };
    const data = await this.subgraphService.getListingMarketItems(params);

    const operations: AnyBulkWriteOperation<any>[] = data.documents.map((doc) =>
      this.mapEntity(chainId, doc),
    );

    await this.listingMarketItemModel.bulkWrite(operations);

    await this.syncService.setLastSyncingIndex(
      chainId,
      collection,
      data.lastSyncingIndex,
    );
  }

  mapEntity(chainId: number, doc: ListingMarketItemDto) {
    const listingId = Number(doc.id);
    const quantityListed = Number(doc.quantityListed);
    const originalQuantityListed = Number(doc.originalQuantityListed);
    const [tokenAddress, tokenId] = doc.token.id.split('-');

    const id = `${chainId}-${doc.id}`;
    const timestamp = new Date(1000 * +doc.timestampCreatedAt);
    const price = Number(doc.price) ?? 0;
    const listed = doc.listed;

    const seller = doc.seller.id;
    const token = {
      id: doc.token.id,
      type: doc.token.type,
      address: tokenAddress,
      tokenId,
      tokenUri: doc.token.tokenUri,
    };

    const currency = {
      id: doc.currency.id,
      name: doc.currency.name,
      symbol: doc.currency.symbol,
      decimals: Number(doc.currency.decimals ?? 0),
    };

    const deadline = new Date(1000 * +doc.deadline);

    return {
      updateOne: {
        filter: { id },
        update: {
          $set: {
            id,
            listingId,
            chainId,
            timestamp,
            price,
            token,
            currency,
            listed,
            seller,
            originalQuantityListed,
            quantityListed,
            deadline,
          },
        },
        upsert: true,
      },
    };
  }
}
