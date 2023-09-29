import { Field, ID, ObjectType } from '@nestjs/graphql';

// DTOs:
import { UserDto } from './user.dto';
import { BaseTokenDto } from './base-token.dto';

@ObjectType()
export class TokenCreationDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly txHash: string;

  @Field()
  readonly blockNumber: string;

  @Field()
  readonly timestamp: string;

  @Field()
  readonly token: BaseTokenDto;

  @Field()
  readonly creator: UserDto;

  @Field()
  readonly name: string;

  @Field()
  readonly image: string;

  @Field()
  readonly artist: string;

  @Field()
  readonly externalUrl: string;

  @Field()
  readonly totalSupply: string;

  @Field()
  readonly secondaryRoyalties: string;

  @Field()
  readonly royaltyReceiver: string;

  @Field()
  readonly syncingIndex: string;
}
