import { Field, ID, ObjectType } from '@nestjs/graphql';

// DTOs:
import { UserDto } from './user.dto';

@ObjectType()
export class ListingPriceUpdateDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly txHash: string;

  @Field()
  readonly blockNumber: string;

  @Field()
  readonly timestampCreatedAt: string;

  @Field()
  readonly seller: UserDto;

  @Field()
  readonly newPrice: number;

  @Field()
  readonly syncingIndex: string;
}
