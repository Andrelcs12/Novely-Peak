// modules/links/links.service.ts

import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";


import { LinkDto } from "./dto/link.dto";
import { PrismaService } from "@/prisma.service";

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  // ======================================================
  // FIND ALL
  // ======================================================

  async findAll(userId: string) {
    return this.prisma.link.findMany({
      where: {
        userId,
        isArchived: false,
      },

      

      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // ======================================================
  // FIND ONE
  // ======================================================

  async findOne(
    id: string,
    userId: string
  ) {
    const link =
      await this.prisma.link.findFirst({
        where: {
          id,
          userId,
        },

        
      });

    if (!link) {
      throw new NotFoundException(
        "Link não encontrado"
      );
    }

    return link;
  }

  // ======================================================
  // CREATE
  // ======================================================

  async create(
    userId: string,
    dto: LinkDto
  ) {
    const domain =
      this.extractDomain(dto.url);

    const favicon =
      domain
        ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        : null;

    return this.prisma.link.create({
      data: {
        title: dto.title,
        description: dto.description,

        url: dto.url,

        domain,
        favicon,

        type:
          dto.type ?? "ARTICLE",

        notes: dto.notes,

        readingTime:
          dto.readingTime,

        isFavorite:
          dto.isFavorite ?? false,

        isArchived:
          dto.isArchived ?? false,

        



        userId,
      },

      
    });
  }

  // ======================================================
  // UPDATE
  // ======================================================

  async update(
    id: string,
    userId: string,
    dto: LinkDto
  ) {
    await this.findOne(id, userId);

    const domain = dto.url
      ? this.extractDomain(dto.url)
      : undefined;

    const favicon =
      domain
        ? `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
        : undefined;

    return this.prisma.link.update({
      where: { id },

      data: {
        title: dto.title,
        description: dto.description,

        url: dto.url,

        domain,
        favicon,

        type: dto.type,

        notes: dto.notes,

        readingTime:
          dto.readingTime,

        isFavorite:
          dto.isFavorite,

        isArchived:
          dto.isArchived,

        

       
      },

     
    });
  }

  // ======================================================
  // DELETE
  // ======================================================

  async remove(
    id: string,
    userId: string
  ) {
    await this.findOne(id, userId);

    return this.prisma.link.delete({
      where: { id },
    });
  }

  // ======================================================
  // TOGGLE FAVORITE
  // ======================================================

  async toggleFavorite(
    id: string,
    userId: string
  ) {
    const link =
      await this.findOne(id, userId);

    return this.prisma.link.update({
      where: { id },

      data: {
        isFavorite:
          !link.isFavorite,
      },
    });
  }

  // ======================================================
  // ARCHIVE
  // ======================================================

  async archive(
    id: string,
    userId: string
  ) {
    await this.findOne(id, userId);

    return this.prisma.link.update({
      where: { id },

      data: {
        isArchived: true,
      },
    });
  }

  // ======================================================
  // OPEN / VIEW
  // ======================================================

  async registerView(
    id: string,
    userId: string
  ) {
    await this.findOne(id, userId);

    return this.prisma.link.update({
      where: { id },

      data: {
        views: {
          increment: 1,
        },

        lastViewedAt:
          new Date(),
      },
    });
  }

  // ======================================================
  // HELPERS
  // ======================================================

  private extractDomain(
    url: string
  ) {
    try {
      return new URL(url)
        .hostname.replace("www.", "");
    } catch {
      return null;
    }
  }
}