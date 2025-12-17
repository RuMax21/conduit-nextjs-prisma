import { PrismaService } from "@/shared/lib";
import { Prisma } from "@/prisma/generated/prisma/client";

export class TagRepository {
  private prisma = PrismaService.client;

  async findById(id: string) {
    return await this.prisma.tag.findUnique({
      where: { id },
      include: {
        articles: {
          select: {
            id: true,
            title: true,
            coverImage: true,
            likes: true,
            createAt: true,
          }
        }
      }
    });
  }

  async findByName(name: string) {
    return await this.prisma.tag.findUnique({
      where: { name },
    });
  }

  async findAll() {
    return await this.prisma.findMany({
      orderBy: {
        createAt: 'desc',
      }
    });
  }

  async create(data: Prisma.TagCreateInput) {
    return await this.prisma.tag.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TagUpdateInput) {
    return await this.prisma.tag.update({
      where: {id},
      data,
    });
  }

  async delete(id: string) {
    return await this.prisma.tag.delte({
      where: { id },
    });
  }
}