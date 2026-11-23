import { relations } from "drizzle-orm";
import {
  bigint,
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  businessName: text("business_name").notNull(),
  contactPerson: text("contact_person"),
  phone: text("phone").notNull(),
  email: text("email"),
  industry: text("industry").notNull().default("Other"),
  status: text("status").notNull().default("New Lead"),
  source: text("source").notNull().default("Website Enquiry"),
  value: bigint("value", { mode: "number" }).notNull().default(0),
  nextFollowUp: date("next_follow_up"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const leadLogs = pgTable(
  "lead_logs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    leadId: uuid("lead_id")
      .notNull()
      .references(() => leads.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    summary: text("summary").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("lead_logs_lead_id_idx").on(table.leadId)],
);

export const leadsRelations = relations(leads, ({ many }) => ({
  logs: many(leadLogs),
}));

export const leadLogsRelations = relations(leadLogs, ({ one }) => ({
  lead: one(leads, {
    fields: [leadLogs.leadId],
    references: [leads.id],
  }),
}));

export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type LeadLog = typeof leadLogs.$inferSelect;
export type NewLeadLog = typeof leadLogs.$inferInsert;
