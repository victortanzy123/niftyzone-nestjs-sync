import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CurrencyDto {
  @Field(() => ID)
  readonly id: string;

  @Field()
  readonly name: string;

  @Field()
  readonly symbol: string;

  @Field()
  readonly decimals: string;
}
