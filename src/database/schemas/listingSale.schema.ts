import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// DTOs:
import { BaseToken } from './baseToken.schema';
import { Currency } from './currency.schema';

export type ListingSaleDocument = ListingSale & Document;

@Schema({ timestamps: true })
export class ListingSale {
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

  @Prop({ index: true })
  listingId: number;

  @Prop()
  currency: Currency;

  @Prop()
  token: BaseToken;

  @Prop({ index: true, lowercase: true })
  buyer: string;

  @Prop({ index: true, lowercase: true })
  seller: string;

  @Prop()
  quantityPurchased: number;

  @Prop()
  totalPricePaid: number;
}

export const ListingSaleSchema = SchemaFactory.createForClass(ListingSale);
