import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { log } from "@/lib/logger";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ success: true, data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ success: false, error: message, details }, { status });
}

export function handleApiError(error: unknown, context: string) {
  if (error instanceof ZodError) {
    return fail("Validation failed", 422, error.flatten());
  }

  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return fail("Unauthorized", 401);
  }

  if (error instanceof Error && error.message === "FORBIDDEN") {
    return fail("Forbidden", 403);
  }

  log("error", `API error in ${context}`, {
    error: error instanceof Error ? error.message : String(error)
  });

  return fail("Something went wrong", 500);
}
