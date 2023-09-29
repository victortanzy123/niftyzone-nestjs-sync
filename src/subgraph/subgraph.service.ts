import { Injectable } from '@nestjs/common';
import request from 'graphql-request';
import { fetch } from './helper/helper';

import { NetworkService } from 'src/network/network.service';

// DTOs:
import { QueryDto } from './dtos/query.dto';
import { TokenCreationDto } from './dtos/token-creation.dto';
import { ListingCreationDto } from './dtos/listing-creation.dto';
import { ListingSaleDto } from './dtos/listing-sale.dto';
import { ListingPriceUpdateDto } from './dtos/listing-price-update.dto';
import { ListingDelistDto } from './dtos/listing-delist.dto';
import { ListingMarketItemDto } from './dtos/listing-market-item.dto';

// Queries:
import { BUNDLES_QUERY } from './queries/bundles';
import { NIFTYZONE_TOKENS_QUERY } from './queries/tokenCreation';
import { LISTING_CREATIONS_QUERY } from './queries/listingCreation';
import { LISTING_SALES_QUERY } from './queries/listingSale';
import { LISTING_PRICE_UPDATES_QUERY } from './queries/listingPriceUpdate';
import { LISTING_DELISTS_QUERY } from './queries/listingDelist';
import { LISTING_MARKET_ITEMS_QUERY } from './queries/listingMarketItem';

@Injectable()
export class SubgraphService {
  constructor(private networkService: NetworkService) {}

  async getBundle(chainId: number) {
    const endpoint = this.networkService.getSubgraphEndpoint(chainId);

    const data = await request<{
      data: { id: string; syncingIndex: string }[];
    }>(endpoint, BUNDLES_QUERY);

    const bundleMap: Record<string, any> = data.data.reduce(
      (a, b) => {
        if (!a[b.id]) {
          a[b.id] = parseInt(b.syncingIndex);
        }
        return a;
      },
      { chainId },
    );

    return bundleMap;
  }

  async getTokenCreations(params: QueryDto) {
    const endpoint = this.networkService.getSubgraphEndpoint(params.chainId);
    const data = await fetch<TokenCreationDto>(
      endpoint,
      NIFTYZONE_TOKENS_QUERY,
      params.lastSyncingIndex,
    );
    return data;
  }

  async getListingCreations(params: QueryDto) {
    const endpoint = this.networkService.getSubgraphEndpoint(params.chainId);
    const data = await fetch<ListingCreationDto>(
      endpoint,
      LISTING_CREATIONS_QUERY,
      params.lastSyncingIndex,
    );
    return data;
  }

  async getListingPriceUpdates(params: QueryDto) {
    const endpoint = this.networkService.getSubgraphEndpoint(params.chainId);
    const data = await fetch<ListingPriceUpdateDto>(
      endpoint,
      LISTING_PRICE_UPDATES_QUERY,
      params.lastSyncingIndex,
    );
    return data;
  }

  async getListingDelists(params: QueryDto) {
    const endpoint = this.networkService.getSubgraphEndpoint(params.chainId);
    const data = await fetch<ListingDelistDto>(
      endpoint,
      LISTING_DELISTS_QUERY,
      params.lastSyncingIndex,
    );
    return data;
  }

  async getListingSales(params: QueryDto) {
    const endpoint = this.networkService.getSubgraphEndpoint(params.chainId);
    const data = await fetch<ListingSaleDto>(
      endpoint,
      LISTING_SALES_QUERY,
      params.lastSyncingIndex,
    );
    return data;
  }

  async getListingMarketItems(params: QueryDto) {
    const endpoint = this.networkService.getSubgraphEndpoint(params.chainId);
    const data = await fetch<ListingMarketItemDto>(
      endpoint,
      LISTING_MARKET_ITEMS_QUERY,
      params.lastSyncingIndex,
    );
    return data;
  }
}
