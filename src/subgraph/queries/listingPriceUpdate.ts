import { gql } from 'graphql-request';

export const LISTING_PRICE_UPDATES_QUERY = gql`
  query MarketItemUpdates($first: Int, $lastSyncingIndex: Int) {
    data: marketItemUpdates(
      first: $first
      orderBy: syncingIndex
      where: { syncingIndex_gt: $lastSyncingIndex }
      subgraphError: allow
    ) {
      id
      txHash
      blockNumber
      timestampCreatedAt
      seller {
        id
      }
      newPrice
      syncingIndex
    }
  }
`;
