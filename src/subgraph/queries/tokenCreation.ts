import { gql } from 'graphql-request';

export const NIFTYZONE_TOKENS_QUERY = gql`
  query NiftyzoneTokens($first: Int, $lastSyncingIndex: Int) {
    data: niftyzoneTokens(
      first: $first
      orderBy: syncingIndex
      where: { syncingIndex_gt: $lastSyncingIndex }
      subgraphError: allow
    ) {
      id
      txHash
      blockNumber
      timestamp
      token {
        id
        tokenUri
      }
      name
      creator {
        id
      }
      image
      artist
      timestamp
      description
      externalUrl
      totalSupply
      secondaryRoyalties
      royaltiesReceiver
      syncingIndex
    }
  }
`;
