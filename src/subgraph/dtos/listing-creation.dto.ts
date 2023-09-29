import { Field, ID, ObjectType } from '@nestjs/graphql';

// DTOs:
import { BaseTokenDto } from './base-token.dto';
import { UserDto } from './user.dto';
import { CurrencyDto } from './currency.dto';

@ObjectType()
export class ListingCreationDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly txHash: string;

  @Field()
  readonly blockNumber: string;

  @Field()
  readonly timestampCreatedAt: string;

  @Field()
  readonly currency: CurrencyDto;

  @Field()
  readonly seller: UserDto;

  @Field()
  readonly token: BaseTokenDto;

  @Field()
  readonly price: string;

  @Field()
  readonly quantity: string;

  @Field()
  readonly deadline: string;

  @Field()
  readonly syncingIndex: string;
}
