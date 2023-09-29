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
  ListingDelist,
  ListingDelistDocument,
} from 'src/database/schemas/listingDelist.schema';

// DTO:
import { ListingDelistDto } from 'src/subgraph/dtos/listing-delist.dto';

// Pre-processor queue:
import { LISTING_DELISTS_PRE_QUEUE } from '../constants';

@Processor(LISTING_DELISTS_PRE_QUEUE)
export class ListingDelistsPreProcessor {
  constructor(
    private syncService: SyncService,
    private subgraphService: SubgraphService,
    @InjectModel(ListingDelist.name, 'database')
    private listingDelistModel: Model<ListingDelistDocument>,
  ) {}

  @Process()
  async process(
    job: Job<{ network: string; chainId: number; lastSyncingIndex: number }>,
  ) {
    const collection = 'marketitemdelists';
    const chainId = job.data.chainId;
    const lastSyncingIndex = job.data.lastSyncingIndex;

    const params = { chainId, lastSyncingIndex };
    const data = await this.subgraphService.getListingDelists(params);

    const operations: AnyBulkWriteOperation<any>[] = data.documents.map((doc) =>
      this.mapEntity(chainId, doc),
    );

    await this.listingDelistModel.bulkWrite(operations);

    await this.syncService.setLastSyncingIndex(
      chainId,
      collection,
      data.lastSyncingIndex,
    );
  }

  mapEntity(chainId: number, doc: ListingDelistDto) {
    const [txHash, x, listingId, _] = doc.id.split('-');
    // To Change:
    const id = `${chainId}-${doc.id}`;
    const blockNumber = Number(doc.blockNumber);
    const seller = doc.seller.id;
    const timestamp = new Date(1000 * +doc.timestampCreatedAt);

    return {
      updateOne: {
        filter: { id },
        update: {
          $set: {
            id,
            chainId,
            txHash,
            blockNumber,
            seller,
            timestamp,
            listingId: Number(listingId),
          },
        },
        upsert: true,
      },
    };
  }
}
