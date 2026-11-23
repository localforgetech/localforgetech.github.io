import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { isCrmAuthed } from "@/lib/crm-auth";
import { db } from "@/lib/db";
import { toLogDTO } from "@/lib/leads-data";
import { leadLogs, leads } from "@/lib/schema";
import { logCreateSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  if (!(await isCrmAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const payload = await request.json().catch(() => null);
    const parsed = logCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Add a short summary of the interaction.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const [lead] = await db
      .select({ id: leads.id })
      .from(leads)
      .where(eq(leads.id, id))
      .limit(1);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const [log] = await db
      .insert(leadLogs)
      .values({
        leadId: id,
        type: parsed.data.type,
        summary: parsed.data.summary,
      })
      .returning();

    return NextResponse.json(
      { ok: true, log: toLogDTO(log) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to add log", error);
    return NextResponse.json(
      { error: "Could not save the activity. Please try again." },
      { status: 500 },
    );
  }
}
