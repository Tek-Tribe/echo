import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { register, login, getProfile, verifyEmailOnLogin, resendVerificationCode } from "./routes/auth";
import { createCampaign, getActiveCampaigns, getBusinessCampaigns, getCampaignById, updateCampaign, updateCampaignStatus } from "./routes/campaigns";
import { createBid, getInfluencerBids, getCampaignBids, updateBidStatus, completeBid, startWork } from "./routes/bids";
import { submitPartnershipApplication, getPartnershipApplications, updatePartnershipApplication } from "./routes/partnership";
import { getEchoConfig, updateEchoConfig, getPartnershipEmail, updatePartnershipEmail } from "./routes/config";
import { getPlatforms } from "./routes/platforms";
import { submitEvidence, getBidEvidence, confirmEvidence } from "./routes/evidence";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Echo API server is running!" });
  });

  // Demo route
  app.get("/api/demo", handleDemo);

  // Auth routes
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.post("/api/auth/verify-email", verifyEmailOnLogin);
  app.post("/api/auth/resend-verification", resendVerificationCode);
  app.get("/api/auth/profile/:userId", getProfile);

  // Platform routes
  app.get("/api/platforms", getPlatforms);

  // Campaign routes
  app.post("/api/campaigns", createCampaign);
  app.get("/api/campaigns/active", getActiveCampaigns);
  app.get("/api/campaigns/business/:businessId", getBusinessCampaigns);
  app.get("/api/campaigns/:campaignId", getCampaignById);
  app.put("/api/campaigns/:campaignId", updateCampaign);
  app.patch("/api/campaigns/:campaignId/status", updateCampaignStatus);

  // Bid routes
  app.post("/api/bids", createBid);
  app.get("/api/bids/influencer/:influencerId", getInfluencerBids);
  app.get("/api/bids/campaign/:campaignId", getCampaignBids);
  app.patch("/api/bids/:bidId/status", updateBidStatus);
  app.patch("/api/bids/:bidId/start-work", startWork);
  app.patch("/api/bids/:bidId/complete", completeBid);

  // Evidence routes
  app.post("/api/evidence", submitEvidence);
  app.get("/api/evidence/bid/:bidId", getBidEvidence);
  app.patch("/api/evidence/bid/:bidId/confirm", confirmEvidence);

  // Partnership routes
  app.post("/api/partnership/apply", submitPartnershipApplication);
  app.get("/api/partnership/applications", getPartnershipApplications);
  app.patch("/api/partnership/applications/:id", updatePartnershipApplication);

  // Config routes (Admin only in production - should add auth middleware)
  app.get("/api/config", getEchoConfig);
  app.put("/api/config", updateEchoConfig);
  app.get("/api/config/partnership-email", getPartnershipEmail);
  app.put("/api/config/partnership-email", updatePartnershipEmail);

  return app;
}
