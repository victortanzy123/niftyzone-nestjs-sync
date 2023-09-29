export interface INetwork {
  network: string;
  subgraph: string;
  chainId: number;
  name: string;
  currency: string;
}

export interface IConfig {
  mainnetChainId: number;
  subgraph: {
    [chainId: string]: string;
  };
  rpc: {
    [chainId: string]: string;
  };
  chainId: {
    [network: string]: string;
  };
  networks: Array<INetwork>;
}
