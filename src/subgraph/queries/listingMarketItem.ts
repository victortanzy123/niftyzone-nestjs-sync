import { gql } from 'graphql-request';

export const LISTING_MARKET_ITEMS_QUERY = gql`
  query MarketItems($first: Int, $lastSyncingIndex: Int) {
    data: marketItems(
      first: $first
      orderBy: syncingIndex
      where: { syncingIndex_gt: $lastSyncingIndex }
      subgraphError: allow
    ) {
      id
      token {
        id
      }
      originalQuantityListed
      quantityListed
      price
      currency {
        id
        type
        name
        symbol
      }
      listed
      timestampCreatedAt
      deadline
      seller {
        id
      }
      syncingIndex
    }
  }
`;
