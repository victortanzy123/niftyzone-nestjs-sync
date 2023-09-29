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
  TokenCreation,
  TokenCreationDocument,
} from 'src/database/schemas/tokenCreation.schema';

// DTO:
import { TokenCreationDto } from 'src/subgraph/dtos/token-creation.dto';

// Pre-processor queue:
import { TOKEN_CREATIONS_PRE_QUEUE } from '../constants';

@Processor(TOKEN_CREATIONS_PRE_QUEUE)
export class TokenCreationsPreProcessor {
  constructor(
    private syncService: SyncService,
    private subgraphService: SubgraphService,
    @InjectModel(TokenCreation.name, 'database')
    private tokenCreationModel: Model<TokenCreationDocument>,
  ) {}

  @Process()
  async process(
    job: Job<{ network: string; chainId: number; lastSyncingIndex: number }>,
  ): Promise<any> {
    const collection = 'niftyzonetokens';
    const chainId = job.data.chainId;
    const lastSyncingIndex = job.data.lastSyncingIndex;

    const params = { chainId, lastSyncingIndex };
    const data = await this.subgraphService.getTokenCreations(params);

    const operations: AnyBulkWriteOperation<any>[] = data.documents.map((doc) =>
      this.mapEntity(chainId, doc),
    );

    const result = await this.tokenCreationModel.bulkWrite(operations);

    await this.syncService.setLastSyncingIndex(
      chainId,
      collection,
      data.lastSyncingIndex,
    );

    return { result, lastSyncingIndex: data.lastSyncingIndex };
  }

  mapEntity(chainId: number, doc: TokenCreationDto) {
    // To Change:
    const id = `${chainId}-${doc.id}`;
    const txHash = doc.txHash;
    const blockNumber = Number(doc.blockNumber);

    const timestamp = new Date(1000 * +doc.timestamp);
    const token = doc.token.id;
    const tokenUri = doc.token.tokenUri;

    const creator = doc.creator.id;
    const name = doc.name;
    const image = doc.image;
    const artist = doc.artist;
    // const externalUrl = doc.externalUrl;
    const royaltyReceiver = doc.royaltyReceiver;
    const secondaryRoyalties = Number(doc.secondaryRoyalties);
    const totalSupply = Number(doc.totalSupply);

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
            creator,
            token,
            tokenUri,
            name,
            image,
            artist,
            royaltyReceiver,
            secondaryRoyalties,
            totalSupply,
          },
        },
        upsert: true,
      },
    };
  }
}
