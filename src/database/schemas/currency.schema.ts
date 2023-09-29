import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CurrencyDocument = Currency & Document;

@Schema({ _id: false })
export class Currency {
  @Prop({ index: true, lowercase: true })
  id: string;

  @Prop()
  name: string;

  @Prop({ index: true })
  symbol: string;

  @Prop()
  decimals: number;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
