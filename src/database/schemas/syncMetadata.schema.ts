import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SyncMetadataDocument = SyncMetadata & Document;

@Schema()
export class SyncMetadata {
  @Prop({ index: true, unique: true })
  chainId: number;

  @Prop({ default: 0 })
  niftyzonetokens: number;

  @Prop({ default: 0 })
  marketitemcreations: number;

  @Prop({ default: 0 })
  marketitemsales: number;

  @Prop({ default: 0 })
  marketitems: number;

  @Prop({ default: 0 })
  marketitemdelists: number;

  @Prop({ default: 0 })
  marketitemupdates: number;
}

export const SyncMetadataSchema = SchemaFactory.createForClass(SyncMetadata);
