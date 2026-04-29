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

  app.enableCors({
  origin: [
    "http://localhost:3000",
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

  console.log("SUPABASE_URL:", process.env.SUPABASE_URL);
console.log("SUPABASE_KEY:", process.env.SUPABASE_ANON_KEY);

  await app.listen(4000, "0.0.0.0");
}
bootstrap();