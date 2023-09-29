import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// DTOs:
import { BaseToken } from './baseToken.schema';
import { Currency } from './currency.schema';

export type ListingMarketItemDocument = ListingMarketItem & Document;

@Schema({ timestamps: true })
export class ListingMarketItem {
  @Prop({ index: true, lowercase: true })
  id: string;

  @Prop({ index: true })
  chainId: number;

  @Prop({ index: true })
  timestamp: Date;

  @Prop({ index: true })
  listingId: number;

  @Prop()
  currency: Currency;

  @Prop()
  token: BaseToken;

  @Prop()
  price: number;

  @Prop({ index: true })
  listed: boolean;

  @Prop({ index: true, lowercase: true })
  seller: string;

  @Prop()
  originalQuantityListed: number;

  @Prop({ index: true })
  quantityListed: number;

  @Prop({ index: true })
  deadline: Date;
}

export const ListingMarketItemSchema =
  SchemaFactory.createForClass(ListingMarketItem);
