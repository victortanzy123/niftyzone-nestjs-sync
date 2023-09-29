import { IsInt, IsNotEmpty } from 'class-validator';

export class QueryDto {
  @IsInt()
  @IsNotEmpty()
  readonly chainId: number;

  @IsInt()
  @IsNotEmpty()
  readonly lastSyncingIndex: number;
}
