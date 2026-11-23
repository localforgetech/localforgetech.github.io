import { NextResponse } from "next/server";

import { clearCrmSession } from "@/lib/crm-auth";

export async function POST() {
  await clearCrmSession();
  return NextResponse.json({ ok: true });
}
