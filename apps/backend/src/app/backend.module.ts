import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthMiddleware, AuthModule } from '@uptownhr/auth-module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { Configuration } from '../configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['dev.env', '.env'],
      isGlobal: true,
    }),

    AuthModule.registerAsync({
      useFactory: (config: ConfigService<Configuration, true>) => {
        const supertokens = config.get('supertokens', { infer: true });
        return {
          connectionURI: supertokens.connectionURI!,
          apiKey: supertokens.apiKey!,
          appName: supertokens.appName!,
          apiDomain: supertokens.apiDomain!,
          websiteDomain: supertokens.websiteDomain!,
          apiBasePath: supertokens.apiBasePath!,
          websiteBasePath: supertokens.websiteBasePath!,
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class BackendModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('*');
  }
}