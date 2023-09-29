import { gql } from 'graphql-request';

export const LISTING_CREATIONS_QUERY = gql`
  query MarketItemCreations($first: Int, $lastSyncingIndex: Int) {
    data: marketItemCreations(
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
        type
        tokenUri
      }
      price
      quantity
      seller {
        id
      }
      currency {
        id
        name
        symbol
        decimals
      }
      deadline
      syncingIndex
    }
  }
`;
