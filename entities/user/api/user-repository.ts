import { Prisma } from "@prisma/client";
import { PrismaService } from "@/shared/lib";

export class UserRepository {
  private prisma = PrismaService.client;

  async findById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return await this.prisma.user.create({
      data
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return await this.prisma.user.update({
      where: { id },
      data
    });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username }
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  async delete(id: string) {
    return await this.prisma.user.delete({
      where: { id }
    });
  }
}