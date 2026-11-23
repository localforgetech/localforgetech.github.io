import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { isCrmAuthed } from "@/lib/crm-auth";
import { db } from "@/lib/db";
import { toLeadDTO } from "@/lib/leads-data";
import { leadLogs, leads } from "@/lib/schema";
import { leadUpdateSchema } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  if (!(await isCrmAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const payload = await request.json().catch(() => null);
    const parsed = leadUpdateSchema.safeParse(payload);

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
    const updates: Partial<typeof leads.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (data.businessName !== undefined) updates.businessName = data.businessName;
    if (data.contactPerson !== undefined)
      updates.contactPerson = data.contactPerson || null;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.email !== undefined) updates.email = data.email || null;
    if (data.industry !== undefined) updates.industry = data.industry;
    if (data.status !== undefined) updates.status = data.status;
    if (data.source !== undefined) updates.source = data.source;
    if (data.value !== undefined) updates.value = data.value;
    if (data.nextFollowUp !== undefined)
      updates.nextFollowUp = data.nextFollowUp || null;
    if (data.notes !== undefined) updates.notes = data.notes || null;

    const [lead] = await db
      .update(leads)
      .set(updates)
      .where(eq(leads.id, id))
      .returning();

    if (!lead) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    const logs = await db
      .select()
      .from(leadLogs)
      .where(eq(leadLogs.leadId, id));

    return NextResponse.json({ ok: true, lead: toLeadDTO(lead, logs) });
  } catch (error) {
    console.error("Failed to update lead", error);
    return NextResponse.json(
      { error: "Could not update the lead. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  if (!(await isCrmAuthed())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const [deleted] = await db
      .delete(leads)
      .where(eq(leads.id, id))
      .returning({ id: leads.id });

    if (!deleted) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, id: deleted.id });
  } catch (error) {
    console.error("Failed to delete lead", error);
    return NextResponse.json(
      { error: "Could not delete the lead. Please try again." },
      { status: 500 },
    );
  }
}
