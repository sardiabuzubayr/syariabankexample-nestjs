import { NestFactory, Reflector } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AccessTokenGuard } from "./security/access_token.guard";

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalGuards(new AccessTokenGuard);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AccessTokenGuard(reflector));
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();