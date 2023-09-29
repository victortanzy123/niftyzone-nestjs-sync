import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TokenCreationDocument = TokenCreation & Document;

@Schema({ timestamps: true })
export class TokenCreation {
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
  token: string;

  @Prop()
  tokenUri: string;

  @Prop({ index: true, lowercase: true })
  creator: string;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop({ index: true, lowercase: true })
  royaltyReceiver: string;

  @Prop()
  secondaryRoyalties: number;

  @Prop()
  totalSupply: number;
}

export const TokenCreationSchema = SchemaFactory.createForClass(TokenCreation);
