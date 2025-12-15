import { PrismaClient, Prisma } from "@prisma/client";

export class PrismaService {
  private static instance: PrismaService
  private client: PrismaClient

  private constructor() {
    this.client = new PrismaClient({
      log: this.getLogLevels(),
      errorFormat: 'pretty',
    });
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService();
    }
    return PrismaService.instance;
  }

  public static get client(): PrismaClient {
    return this.getInstance().getClient();
  }

  public static getClient(): PrismaClient {
    return this.client;
  }

  public async connect(): Promise<void> {
    await this.client.$connect();
  }

  public async disconnect(): Promise<void> {
    await this.client.$disconnect();
  }

  private getLogLevels(): Prisma.LogLevel[] {
    if (process.env.NODE_ENV === "development") {
      return ['query', 'error', 'warn'];
    }
    return ['error'];
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.client.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

export const prisma = PrismaService.client;