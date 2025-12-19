import { UserRepository } from "@/entities/user/api/user-repository";
import { createUserSchema } from "@/entities/user/api/user-schema";
import { validateRequest } from "@/shared/lib/validation/validate-request";
import { NextRequest, NextResponse } from "next/server";

const userRepository = new UserRepository();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get("id");
    const username = searchParams.get("username");
    const email = searchParams.get("email");

    if (id) {
      const user = await userRepository.findById(id);

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    if (username) {
      const user = await userRepository.findByUsername(username);

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    if (email) {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(user);
    }

    return NextResponse.json(
      { error: "Please provide id, username or email" },
      { status: 400 }
    );
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
    const validation = validateRequest(createUserSchema, body);

    if (!validation.success) {
      return validation.error;
    }

    const existingUser = await userRepository.findByUsername(validation.data.username);
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    const existingEmail = await userRepository.findByUsername(validation.data.email);
    if (existingEmail) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    const user = await userRepository.create({
      username: validation.data.username,
      email: validation.data.email,
      passwordHash: validation.data.passwordHash,
      imageUrl: validation.data.imageUrl || undefined
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}