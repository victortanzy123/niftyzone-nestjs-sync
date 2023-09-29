import { Field, ID, ObjectType } from '@nestjs/graphql';

// DTOs:
import { UserDto } from './user.dto';

@ObjectType()
export class ListingDelistDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly txHash: string;

  @Field()
  readonly blockNumber: number;

  @Field()
  readonly seller: UserDto;

  @Field()
  readonly timestampCreatedAt: Date;

  @Field()
  readonly syncingIndex: string;
}
