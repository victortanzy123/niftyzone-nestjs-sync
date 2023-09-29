import { Field, ID, ObjectType } from '@nestjs/graphql';

// DTOs:
import { UserDto } from './user.dto';
import { CurrencyDto } from './currency.dto';
import { BaseTokenDto } from './base-token.dto';

@ObjectType()
export class ListingSaleDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly txHash: string;

  @Field()
  readonly blockNumber: string;

  @Field()
  readonly timestampCreatedAt: string;

  @Field()
  readonly buyer: UserDto;

  @Field()
  readonly seller: UserDto;

  @Field()
  readonly currency: CurrencyDto;

  @Field()
  readonly token: BaseTokenDto;

  @Field()
  readonly quantityPurchased: string;

  @Field()
  readonly totalPricePaid: string;

  @Field()
  readonly syncingIndex: string;
}
