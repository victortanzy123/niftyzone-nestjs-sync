import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// DTOs:
import { BaseToken } from './baseToken.schema';
import { Currency } from './currency.schema';

export type ListingCreationDocument = ListingCreation & Document;

@Schema({ timestamps: true })
export class ListingCreation {
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

  @Prop()
  token: BaseToken;

  @Prop({ index: true })
  listingId: number;

  @Prop()
  currency: Currency;

  @Prop({ index: true, lowercase: true })
  seller: string;

  @Prop()
  price: number;

  @Prop()
  quantity: number;

  @Prop({ index: true })
  deadline: Date;
}

export const ListingCreationSchema =
  SchemaFactory.createForClass(ListingCreation);
