import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // ✅ PREFIXO GLOBAL (organização)
  app.setGlobalPrefix("api");

  // ✅ VALIDAÇÃO GLOBAL (CRÍTICO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // remove campos não permitidos
      forbidNonWhitelisted: true, // bloqueia payload inválido
      transform: true,
    }),
  );

  // ✅ CORS SEGURO (evite origin: true em produção)
  app.enableCors({
    origin: [
      "http://localhost:3000",
      "http://192.168.0.129:3000",
    ],
    credentials: true,
  });

  await app.listen(3000, "0.0.0.0");
}
bootstrap();