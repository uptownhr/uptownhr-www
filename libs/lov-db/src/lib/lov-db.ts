import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/client';
import {
  LovDbModuleConfig,
  MODULE_OPTIONS_TOKEN,
} from './lov-db.module-definition';

@Injectable()
export class LovDb extends PrismaClient implements OnModuleInit {
  constructor(@Inject(MODULE_OPTIONS_TOKEN) private config: LovDbModuleConfig) {
    super({
      datasources: {
        db: {
          url: config.databaseURL,
        },
      },
    });
  }
  async onModuleInit() {
    await this.$connect();
  }
}
