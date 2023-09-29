import { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import { IConfig } from './helper/types';

@Injectable()
export class NetworkService implements OnModuleInit {
  private config: Partial<IConfig> = {};

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const path = this.configService.get('NETWORK_MAP');
    this.config = JSON.parse(fs.readFileSync(path, 'utf8'));
  }

  getMainnetChainId(): number {
    const chainId = this.config.mainnetChainId;
    if (!chainId) {
      throw new Error(`Could not find chain id for mainnet`);
    }
    return chainId;
  }

  getChainId(network: string): string {
    const chainId = this.config.chainId[network];
    if (!chainId) {
      throw new Error(`Could not find chain id for ${network}`);
    }
    return chainId;
  }

  getNetworksUsed() {
    const networks = this.config.networks;
    if (!networks) {
      throw new Error(`Could not find networks`);
    }
    return networks;
  }

  getSubgraphEndpoint(chainId: number) {
    const networks = this.getNetworksUsed();
    const found = networks.find(({ chainId: _chainId }) => {
      if (_chainId == chainId) return true;
    });
    const url = found.subgraph;
    if (!url) {
      throw new Error(`No subgraph URL for network chainId: ${chainId}`);
    }
    return url;
  }

  getRpcEndpoint(chainId: number) {
    const chainIdStr = chainId.toString();
    const url = this.config.rpc[chainIdStr];
    if (!url) {
      throw new Error(`No RPC URL for chainId: ${chainIdStr}`);
    }
    return url;
  }
}
