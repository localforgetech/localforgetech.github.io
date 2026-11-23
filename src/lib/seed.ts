import "dotenv/config";

import { db } from "./db";
import { leadLogs, leads } from "./schema";

async function main() {
  const existing = await db.select({ id: leads.id }).from(leads).limit(1);
  if (existing.length > 0) {
    console.log("Seed skipped: leads already exist.");
    return;
  }

  const [fitness, academy] = await db
    .insert(leads)
    .values([
      {
        businessName: "Jind Fitness Hub",
        contactPerson: "Rahul Sharma",
        phone: "9812345678",
        email: "hello@jindfitnesshub.in",
        industry: "Gym & Fitness",
        status: "Proposal Sent",
        source: "Cold Visit",
        value: 25000,
        nextFollowUp: "2026-12-05",
        notes:
          "Requested a custom member attendance and workout tracking app.",
      },
      {
        businessName: "Haryana Global Academy",
        contactPerson: "Dr. V. K. Verma",
        phone: "9416012345",
        email: "office@hgarohtak.edu.in",
        industry: "Education",
        status: "Meeting Scheduled",
        source: "Referral",
        value: 50000,
        nextFollowUp: "2026-12-02",
        notes: "School fee collection portal and student ID app demo.",
      },
    ])
    .returning();

  await db.insert(leadLogs).values({
    leadId: fitness.id,
    type: "In-Person Meeting",
    summary: "Met at the gym and discussed integration requirements.",
  });

  console.log(`Seeded ${fitness.businessName} and ${academy.businessName}.`);
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
