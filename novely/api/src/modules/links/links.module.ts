// modules/links/links.module.ts

import { Module } from "@nestjs/common";

import { LinksController } from "./links.controller";
import { LinksService } from "./links.service";
import { PrismaService } from "@/prisma.service";


@Module({
  controllers: [LinksController],
  providers: [
    LinksService,
    PrismaService,
  ],
})
export class LinksModule {}