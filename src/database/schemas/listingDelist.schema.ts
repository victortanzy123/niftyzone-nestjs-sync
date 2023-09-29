import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListingDelistDocument = ListingDelist & Document;

@Schema({ timestamps: true })
export class ListingDelist {
  @Prop({ index: true, lowercase: true })
  id: string;

  @Prop({ index: true })
  chainId: number;

  @Prop({ lowercase: true })
  txHash: string;

  @Prop({ index: true })
  blockNumber: number;

  @Prop({ index: true })
  timestamp: Date;

  @Prop({ index: true, lowercase: true })
  seller: string;

  @Prop({ index: true })
  listingId: number;
}

export const ListingDelistSchema = SchemaFactory.createForClass(ListingDelist);
