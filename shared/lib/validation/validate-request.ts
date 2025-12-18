import { NextResponse } from "next/server";
import { z } from "zod";

export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: NextResponse } {
    const result = schema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        error: NextResponse.json (
        {
          error: "Validation failed",
          details: result.error.errors
        },
        { status: 400 }
      )};
    }

    return {
      success: true,
      data: result.data
    };
  }