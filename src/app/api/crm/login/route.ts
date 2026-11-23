import { NextResponse } from "next/server";

import { setCrmSession, verifyPassword } from "@/lib/crm-auth";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Enter the access key to continue." },
        { status: 400 },
      );
    }

    if (!verifyPassword(parsed.data.password)) {
      return NextResponse.json(
        { error: "Incorrect access key. Please try again." },
        { status: 401 },
      );
    }

    await setCrmSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("CRM login failed", error);
    return NextResponse.json(
      { error: "Could not sign in right now. Please try again." },
      { status: 500 },
    );
  }
}
