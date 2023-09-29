import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ListingPriceUpdateDocument = ListingPriceUpdate & Document;

@Schema({ timestamps: true })
export class ListingPriceUpdate {
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

  @Prop()
  newPrice: number;
}

export const ListingPriceUpdateSchema =
  SchemaFactory.createForClass(ListingPriceUpdate);
