ALTER TABLE "campaigns" ADD COLUMN "max_influencers" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "auto_accept_bids" boolean DEFAULT false;