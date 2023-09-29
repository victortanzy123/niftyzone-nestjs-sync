import { Field, ID, ObjectType } from '@nestjs/graphql';

// DTOs:
import { UserDto } from './user.dto';
import { CurrencyDto } from './currency.dto';
import { BaseTokenDto } from './base-token.dto';

@ObjectType()
export class ListingMarketItemDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly token: BaseTokenDto;

  @Field()
  readonly originalQuantityListed: string;

  @Field()
  readonly quantityListed: string;

  @Field()
  readonly timestampCreatedAt: string;

  @Field()
  readonly price: string;

  @Field()
  readonly seller: UserDto;

  @Field()
  readonly currency: CurrencyDto;

  @Field()
  readonly listed: string;

  @Field()
  readonly deadline: string;

  @Field()
  readonly syncingIndex: string;
}
