import { timingSafeEqual } from "node:crypto";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function bearerToken(request: NextRequest): string {
  const authorization = request.headers.get("authorization") ?? "";

  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

function tokensMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  return (
    providedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(providedBuffer, expectedBuffer)
  );
}

export async function POST(request: NextRequest) {
  const secret = process.env.HOME_REVALIDATION_SECRET?.trim();

  if (!secret) {
    return NextResponse.json(
      { message: "Homepage revalidation is not configured." },
      { status: 503 },
    );
  }

  if (!tokensMatch(bearerToken(request), secret)) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  revalidateTag("home", "max");
  revalidatePath("/");

  return NextResponse.json({
    revalidated: true,
    tag: "home",
    path: "/",
    now: Date.now(),
  });
}
