import { request, RequestDocument } from 'graphql-request';
import { SUBGRAPH_FETCH_LIMIT } from './constants';

export async function fetch<T extends { syncingIndex: string }>(
  endpoint: string,
  query: RequestDocument,
  lastSyncingIndex: number,
) {
  const variables = { lastSyncingIndex, first: SUBGRAPH_FETCH_LIMIT };
  const response = await request<{ data: T[] }>(endpoint, query, variables);
  const documents = response.data;

  let syncingIndex = lastSyncingIndex;

  if (documents.length > 0) {
    syncingIndex = parseInt(documents[documents.length - 1].syncingIndex);
  }

  return { documents, lastSyncingIndex: syncingIndex };
}

export async function fetchAll(endpoint: string, query: any, variables: any) {
  let documents: any[] = [];
  let lastId = variables.lastId ?? '';
  let allFound = false;

  while (!allFound) {
    const response = await request(endpoint, query, { ...variables, lastId });
    const data = response?.data ?? [];
    documents = documents.concat(data);

    allFound = data.length < 1000;
    if (data.length === 1000) {
      lastId = data?.[data.length - 1]?.id ?? lastId;
    }
  }

  return { documents, lastId };
}
