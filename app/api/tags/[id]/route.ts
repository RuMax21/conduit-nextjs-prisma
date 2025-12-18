import { TagRepository } from "@/entities/tag/tag-repository";
import { updateTagSchema } from "@/entities/tag/tag-schema";
import { validateRequest } from "@/shared/lib/validation/validate-request";
import { NextRequest, NextResponse } from "next/server";

const tagRepository = new TagRepository();

export async function GET(request: NextRequest,
  {params}: {params: {id: string} }
) {
  try {
    const tag = await tagRepository.findById(params.id);

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(tag);
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
    const validation = validateRequest(updateTagSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const tag = await tagRepository.findById(params.id);

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    if (validation.data.name) {
      const existingTag = await tagRepository.findByName(validation.data.name);

      if (existingTag && existingTag.id !== params.id) {
        return NextResponse.json(
          { error: "Tag name already exists" },
          { status: 409 }
        );
      }
    }

    const updatedTag = await tagRepository.update(params.id, validation.data);
    return NextResponse.json(updatedTag);
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
    const tag = await tagRepository.findById(params.id);

    if (!tag) {
      return NextResponse.json(
        { error: "Tag not found" },
        { status: 404 }
      );
    }

    await tagRepository.delete(params.id);
    return NextResponse.json({
      message: "Tag deleted successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}