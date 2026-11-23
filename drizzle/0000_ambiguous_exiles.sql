CREATE TABLE "lead_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"type" text NOT NULL,
	"summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"business_name" text NOT NULL,
	"contact_person" text,
	"phone" text NOT NULL,
	"email" text,
	"industry" text DEFAULT 'Other' NOT NULL,
	"status" text DEFAULT 'New Lead' NOT NULL,
	"source" text DEFAULT 'Website Enquiry' NOT NULL,
	"value" bigint DEFAULT 0 NOT NULL,
	"next_follow_up" date,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_logs" ADD CONSTRAINT "lead_logs_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_logs_lead_id_idx" ON "lead_logs" USING btree ("lead_id");