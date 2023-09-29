import { Module } from '@nestjs/common';
import { SubgraphService } from './subgraph.service';

// Sub-modules:
import { NetworkModule } from 'src/network/network.module';

@Module({
  imports: [NetworkModule],
  providers: [SubgraphService],
  exports: [SubgraphService],
})
export class SubgraphModule {}
