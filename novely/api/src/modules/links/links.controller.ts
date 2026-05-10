// modules/links/links.controller.ts

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";

import { AuthGuard } from "../auth/auth.guard";

import { LinksService } from "./links.service";

import { LinkDto } from "./dto/link.dto";

@UseGuards(AuthGuard)
@Controller("links")
export class LinksController {
  constructor(
    private readonly linksService: LinksService
  ) {}

  // ======================================================
  // GET ALL
  // ======================================================

  @Get()
  findAll(@Req() req: any) {
    return this.linksService.findAll(
      req.user.id
    );
  }

  // ======================================================
  // GET ONE
  // ======================================================

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Req() req: any
  ) {
    return this.linksService.findOne(
      id,
      req.user.id
    );
  }

  // ======================================================
  // CREATE
  // ======================================================

  @Post()
  create(
    @Req() req: any,
    @Body() dto: LinkDto
  ) {
    return this.linksService.create(
      req.user.id,
      dto
    );
  }

  // ======================================================
  // UPDATE
  // ======================================================

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Req() req: any,
    @Body() dto: LinkDto
  ) {
    return this.linksService.update(
      id,
      req.user.id,
      dto
    );
  }

  // ======================================================
  // FAVORITE
  // ======================================================

  @Patch(":id/favorite")
  favorite(
    @Param("id") id: string,
    @Req() req: any
  ) {
    return this.linksService.toggleFavorite(
      id,
      req.user.id
    );
  }

  // ======================================================
  // ARCHIVE
  // ======================================================

  @Patch(":id/archive")
  archive(
    @Param("id") id: string,
    @Req() req: any
  ) {
    return this.linksService.archive(
      id,
      req.user.id
    );
  }

  // ======================================================
  // VIEW
  // ======================================================

  @Patch(":id/view")
  view(
    @Param("id") id: string,
    @Req() req: any
  ) {
    return this.linksService.registerView(
      id,
      req.user.id
    );
  }

  // ======================================================
  // DELETE
  // ======================================================

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Req() req: any
  ) {
    return this.linksService.remove(
      id,
      req.user.id
    );
  }
}