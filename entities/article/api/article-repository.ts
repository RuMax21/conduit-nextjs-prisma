import { Prisma } from '@/prisma/generated/prisma/client'
import { PrismaService } from "@/shared/lib";
import { CreateArticleDto, UpdateArticleDto } from './article-dto';

export class ArticleRepository {
  private prisma = PrismaService.client;

  async getPreview(option: {
    page?: number,
    limit?: number,
    authorId?: string,
    tagId?: string
  }) {
    const page = option.page || 1;
    const limit = option.limit || 10;
    const skip = (page - 1) * limit;

    const where: Prisma.ArticleWhereInput = {};

    if (option.authorId) {
      where.authorId = option.authorId;
    }

    if (option.tagId) {
      where.tagId = option.tagId;
    }

    const articles = await this.prisma.article.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        coverImage: true,
        likes: true,
        createAt: true,
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true
          }
        },
        tag: {
          select: {
            id: true,
            name: true
          }
        },
        orderBy: {
          createAt: 'desc'
        }
      }
    });

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      coverImage: article.coverImage,
      likes: article.likes,
      views: 0,
      createdAt: article.createdAt,
      author: article.author,
      tags: article.tag ? [article.tag] : []
    }));
  }

  async findById(id: string) {
    return await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl:  true
          }
        },
        tag: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
  }

  async create(data: CreateArticleDto) {
    return await this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        coverImage: data.coverImage,
        authorId: data.authorId,
        tagId: data.tagIds && data.tagIds.length > 0 ? data.tagIds[0] : null
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true
          }
        },
        tag: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  }

  async update(data: UpdateArticleDto) {
    return await this.prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        coverImage: data.coverImage,
      },
      include: {
        author: {
          select: {
            id: true,
            username: true,
            imageUrl: true
          }
        },
        tag: {
          select: {
            id: true,
            name: true,
          }
        }
      }
    });
  }

  async delete(id: string) {
    return await this.prisma.delete({
      where: { id }
    });
  }

  async incrementLikes(id: string) {
    return await this.prisma.article.update({
      where: { id },
      data: {
        likes: {
          increment: 1
        }
      }
    });
  }

  async decrementLikes(id: string) {
    return await this.prisma.article.update({
      where: { id },
      data: {
        likes: {
          decrement: 1
        }
      }
    });
  }
}