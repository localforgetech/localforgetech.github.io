import { NextResponse } from "next/server";

import { isCrmAuthed } from "@/lib/crm-auth";
import { db } from "@/lib/db";
import { getLeadsWithLogs, toLeadDTO } from "@/lib/leads-data";
import { leads } from "@/lib/schema";
import { leadCreateSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isCrmAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getLeadsWithLogs();
    return NextResponse.json({ leads: data });
  } catch (error) {
    console.error("Failed to load leads", error);
    return NextResponse.json(
      { error: "Could not load leads. Please refresh." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!(await isCrmAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json().catch(() => null);
    const parsed = leadCreateSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const [lead] = await db
      .insert(leads)
      .values({
        businessName: data.businessName,
        contactPerson: data.contactPerson || null,
        phone: data.phone,
        email: data.email || null,
        industry: data.industry,
        status: data.status,
        source: data.source,
        value: data.value,
        nextFollowUp: data.nextFollowUp || null,
        notes: data.notes || null,
      })
      .returning();

    return NextResponse.json(
      { ok: true, lead: toLeadDTO(lead, []) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create lead", error);
    return NextResponse.json(
      { error: "Could not save the lead. Please try again." },
      { status: 500 },
    );
  }
}
