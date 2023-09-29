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
  ListingCreation,
  ListingCreationDocument,
} from 'src/database/schemas/listingCreation.schema';

// DTO:
import { ListingCreationDto } from 'src/subgraph/dtos/listing-creation.dto';

// Pre-processor queue:
import { LISTING_CREATIONS_PRE_QUEUE } from '../constants';

@Processor(LISTING_CREATIONS_PRE_QUEUE)
export class ListingCreationsPreProcessor {
  constructor(
    private syncService: SyncService,
    private subgraphService: SubgraphService,
    @InjectModel(ListingCreation.name, 'database')
    private listingCreationModel: Model<ListingCreationDocument>,
  ) {}

  @Process()
  async process(
    job: Job<{ network: string; chainId: number; lastSyncingIndex: number }>,
  ): Promise<any> {
    const collection = 'marketitemcreations';
    const chainId = job.data.chainId;
    const lastSyncingIndex = job.data.lastSyncingIndex;

    const params = { chainId, lastSyncingIndex };
    const data = await this.subgraphService.getListingCreations(params);

    const operations: AnyBulkWriteOperation<any>[] = data.documents.map((doc) =>
      this.mapEntity(chainId, doc),
    );

    const result = await this.listingCreationModel.bulkWrite(operations);

    await this.syncService.setLastSyncingIndex(
      chainId,
      collection,
      data.lastSyncingIndex,
    );

    return { result, lastSyncingIndex: data.lastSyncingIndex };
  }

  mapEntity(chainId: number, doc: ListingCreationDto) {
    const [hash, logIndex, listingId, suffix] = doc.id.split('-');
    const [tokenAddress, tokenId] = doc.token.id.split('-');
    // To Change:
    const id = `${chainId}-${doc.id}`;
    const txHash = doc.txHash;
    const blockNumber = Number(doc.blockNumber);
    const timestamp = new Date(1000 * +doc.timestampCreatedAt);
    const type = doc.token.type.toString();
    const tokenUri = doc.token.tokenUri;
    const token = {
      id: doc.token.id,
      type,
      address: tokenAddress,
      tokenId,
      tokenUri,
    };
    const currency = {
      id: doc.currency.id,
      name: doc.currency.name,
      symbol: doc.currency.symbol,
      decimals: Number(doc.currency.decimals),
    };
    const seller = doc.seller.id;
    const price = Number(doc.price);
    const quantity = Number(doc.quantity);
    const deadline = new Date(1000 * +doc.deadline);

    return {
      updateOne: {
        filter: { id },
        update: {
          $set: {
            id,
            chainId,
            txHash,
            blockNumber,
            listingId: Number(listingId),
            currency,
            timestamp,
            token,
            seller,
            price,
            quantity,
            deadline,
          },
        },
        upsert: true,
      },
    };
  }
}
