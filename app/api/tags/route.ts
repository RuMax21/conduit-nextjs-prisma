import { TagRepository } from "@/entities/tag/tag-repository";
import { createTagSchema } from "@/entities/tag/tag-schema";
import { validateRequest } from "@/shared/lib/validation/validate-request";
import { NextRequest, NextResponse } from "next/server";

const tagRepository = new TagRepository();

export async function GET(request:NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const name = searchParams.get("name");
  
    if (id) {
      const tag = await tagRepository.findById(id);

      if (!tag) {
        return NextResponse.json(
          { error: "Tag not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(tag);
    }

    if (name) {
      const tag = await tagRepository.findByName(name);
      
      if (!tag) {
        return NextResponse.json(
          { error: "Tag not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(tag);
    }

    const tag = await tagRepository.findAll();
    return NextResponse.json(tag);
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
    const validation = validateRequest(createTagSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const existingTag = await tagRepository.findByName(validation.data.name);

    if (existingTag) {
      return NextResponse.json(
        { error: "Tag already exists" },
        { status: 409 }
      );
    }

    const tag = await tagRepository.create({
      name: validation.data.name
    });

    return NextResponse.json(tag, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}