import { ArticleRepository } from "@/entities/article/api/article-repository";
import { updateArticleSchema } from "@/entities/article/api/article-schema";
import { validateRequest } from "@/shared/lib/validation/validate-request";
import { NextRequest, NextResponse } from "next/server";

const articleRepository = new ArticleRepository();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await articleRepository.findById(params.id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validation = validateRequest(updateArticleSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const article = await articleRepository.findById(params.id);
    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const updatedArticle = await articleRepository.update(params.id, validation.data);
    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const article = await articleRepository.findById(params.id);

    if(!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    await articleRepository.delete(params.id);
    return NextResponse.json({
      message: "Article deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}