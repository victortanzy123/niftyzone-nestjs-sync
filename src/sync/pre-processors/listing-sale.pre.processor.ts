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
  ListingSale,
  ListingSaleDocument,
} from 'src/database/schemas/listingSale.schema';

// DTO:
import { ListingSaleDto } from 'src/subgraph/dtos/listing-sale.dto';

// Pre-processor queue:
import { LISTING_SALES_PRE_QUEUE } from '../constants';

@Processor(LISTING_SALES_PRE_QUEUE)
export class ListingSalesPreProcessor {
  constructor(
    private syncService: SyncService,
    private subgraphService: SubgraphService,
    @InjectModel(ListingSale.name, 'database')
    private listingSaleModel: Model<ListingSaleDocument>,
  ) {}

  @Process()
  async process(
    job: Job<{ network: string; chainId: number; lastSyncingIndex: number }>,
  ) {
    const collection = 'marketitemsales';
    const chainId = job.data.chainId;
    const lastSyncingIndex = job.data.lastSyncingIndex;

    const params = { chainId, lastSyncingIndex };
    const data = await this.subgraphService.getListingSales(params);

    const operations: AnyBulkWriteOperation<any>[] = data.documents.map((doc) =>
      this.mapEntity(chainId, doc),
    );

    await this.listingSaleModel.bulkWrite(operations);

    await this.syncService.setLastSyncingIndex(
      chainId,
      collection,
      data.lastSyncingIndex,
    );
  }

  mapEntity(chainId: number, doc: ListingSaleDto) {
    const [txHash, logIndex, listingId, _] = doc.id.split('-');
    const [tokenAddress, tokenId] = doc.token.id.split('-');
    // To Change:
    const id = `${chainId}-${doc.id}`;
    const blockNumber = Number(doc.blockNumber);
    const timestamp = new Date(1000 * +doc.timestampCreatedAt);

    const buyer = doc.buyer.id;
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
      decimals: Number(doc.currency.decimals),
    };

    const quantityPurchased = Number(doc.quantityPurchased);
    const totalPricePaid = Number(doc.totalPricePaid);

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
            currency,
            token,
            listingId: Number(listingId),
            buyer,
            seller,
            quantityPurchased,
            totalPricePaid,
          },
        },
        upsert: true,
      },
    };
  }
}
