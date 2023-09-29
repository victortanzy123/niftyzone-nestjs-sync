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
  ListingPriceUpdate,
  ListingPriceUpdateDocument,
} from 'src/database/schemas/listingPriceUpdate.schema';

// DTO:
import { ListingPriceUpdateDto } from 'src/subgraph/dtos/listing-price-update.dto';

// Pre-processor queue:
import { LISTING_PRICE_UPDATES_PRE_QUEUE } from '../constants';

@Processor(LISTING_PRICE_UPDATES_PRE_QUEUE)
export class ListingPriceUpdatesPreProcessor {
  constructor(
    private syncService: SyncService,
    private subgraphService: SubgraphService,
    @InjectModel(ListingPriceUpdate.name, 'database')
    private listingPriceUpdateModel: Model<ListingPriceUpdateDocument>,
  ) {}

  @Process()
  async process(
    job: Job<{ network: string; chainId: number; lastSyncingIndex: number }>,
  ) {
    const collection = 'marketitemupdates';
    const chainId = job.data.chainId;
    const lastSyncingIndex = job.data.lastSyncingIndex;

    const params = { chainId, lastSyncingIndex };
    const data = await this.subgraphService.getListingPriceUpdates(params);

    const operations: AnyBulkWriteOperation<any>[] = data.documents.map((doc) =>
      this.mapEntity(chainId, doc),
    );

    console.log('Mapping price updates', operations);
    await this.listingPriceUpdateModel.bulkWrite(operations);

    await this.syncService.setLastSyncingIndex(
      chainId,
      collection,
      data.lastSyncingIndex,
    );
  }

  mapEntity(chainId: number, doc: ListingPriceUpdateDto) {
    const [txHash, logIndex, listingId, _] = doc.id.split('-');
    const id = `${chainId}-${doc.id}}`;
    const blockNumber = Number(doc.blockNumber);
    const timestamp = new Date(1000 * +doc.timestampCreatedAt);
    const seller = doc.seller.id;
    const newPrice = doc.newPrice;

    return {
      updateOne: {
        filter: { id },
        update: {
          $set: {
            id,
            chainId,
            txHash,
            blockNumber,
            timestamp,
            seller,
            listingId,
            newPrice,
          },
        },
        upsert: true,
      },
    };
  }
}
