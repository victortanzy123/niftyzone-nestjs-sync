import { gql } from 'graphql-request';

export const LISTING_DELISTS_QUERY = gql`
  query MarketItemDelists($first: Int, $lastSyncingIndex: Int) {
    data: marketItemDelists(
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
      syncingIndex
    }
  }
`;
