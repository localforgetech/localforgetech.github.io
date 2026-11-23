import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { leads } from "@/lib/schema";
import { enquirySchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => null);
    const parsed = enquirySchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please check the highlighted fields and try again.",
          issues: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const followUp = new Date(Date.now() + 86_400_000)
      .toISOString()
      .slice(0, 10);

    const [lead] = await db
      .insert(leads)
      .values({
        businessName: data.businessName,
        contactPerson: data.contactPerson || null,
        phone: data.phone,
        industry: data.industry,
        status: "New Lead",
        source: "Website Enquiry",
        value: data.value,
        nextFollowUp: followUp,
        notes: data.notes || null,
      })
      .returning();

    return NextResponse.json(
      {
        ok: true,
        lead: { id: lead.id, businessName: lead.businessName },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Enquiry submission failed", error);
    return NextResponse.json(
      {
        error:
          "We could not submit your enquiry right now. Please try again or message us on WhatsApp.",
      },
      { status: 500 },
    );
  }
}
