import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BaseTokenDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly address: string;

  @Field()
  readonly type: string;

  @Field()
  readonly tokenId: number;

  @Field()
  readonly tokenUri: string;

  @Field()
  readonly syncingIndex: string;
}
