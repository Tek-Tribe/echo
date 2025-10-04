CREATE TABLE "echo_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"partnership_notification_email" varchar(255),
	"default_currency" varchar(10) DEFAULT 'INR',
	"timezone" varchar(50) DEFAULT 'UTC',
	"platform_name" varchar(100) DEFAULT 'Echo Platform',
	"updated_at" timestamp with time zone DEFAULT now(),
	"updated_by" uuid
);
--> statement-breakpoint
ALTER TABLE "echo_config" ADD CONSTRAINT "echo_config_updated_by_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;