import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BaseTokenDocument = BaseToken & Document;

@Schema({ _id: false })
export class BaseToken {
  @Prop({ index: true, lowercase: true })
  id: string;

  @Prop({ index: true, lowercase: true })
  address: string;

  @Prop({ index: true, lowercase: true })
  type: string;

  @Prop({ index: true, lowercase: true })
  BasetokenId: number;

  @Prop()
  BasetokenUri: string;
}

export const BaseTokenSchema = SchemaFactory.createForClass(BaseToken);
