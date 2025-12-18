import { ArticleRepository } from "@/entities/article/api/article-repository";
import { NextRequest, NextResponse } from "next/server";

const articleRepository = new ArticleRepository();

export async function POST(
  request: NextResponse,
  { params }: { params: {id: string} }
) {
  try {
    const article = await articleRepository.findById(params.id);

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const updatedArticle = await articleRepository.incrementLikes(params.id);
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

    if (!article) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    const updatedArticle = await articleRepository.decrementLikes(params.id);
    return NextResponse.json(updatedArticle);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}