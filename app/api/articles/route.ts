import { ArticleRepository } from "@/entities/article/api/article-repository";
import { createArticleSchema } from "@/entities/article/api/article-schema";
import { validateRequest } from "@/shared/lib/validation/validate-request";
import { NextRequest, NextResponse } from "next/server";

const articleRepository = new ArticleRepository();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || 1);
    const limit = parseInt(searchParams.get("limit") || 10);
    const authorId = searchParams.get("authorId") || undefined;
    const tagId = searchParams.get("tagId") || undefined;

    const articles = await articleRepository.getPreview({
      page,
      limit,
      authorId,
      tagId
    });

    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateRequest(createArticleSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const article = await articleRepository.create(validation.data);
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}