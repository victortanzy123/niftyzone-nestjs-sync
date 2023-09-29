import { gql } from 'graphql-request';

export const LISTING_SALES_QUERY = gql`
  query MarketItemSales($first: Int, $lastSyncingIndex: Int) {
    data: marketItemSales(
      first: $first
      orderBy: syncingIndex
      where: { syncingIndex_gt: $lastSyncingIndex }
      subgraphError: allow
    ) {
      id
      txHash
      blockNumber
      timestampCreatedAt
      token {
        id
        tokenUri
      }
      currency {
        id
        name
        symbol
        decimals
      }
      seller {
        id
      }
      buyer {
        id
      }
      quantityPurchased
      totalPricePaid
      syncingIndex
    }
  }
`;
