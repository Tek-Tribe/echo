import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { register, login, getProfile } from "./routes/auth";
import { createCampaign, getActiveCampaigns, getBusinessCampaigns, getCampaignById, updateCampaign, updateCampaignStatus } from "./routes/campaigns";
import { createBid, getInfluencerBids, getCampaignBids, updateBidStatus, completeBid } from "./routes/bids";

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
  app.get("/api/auth/profile/:userId", getProfile);

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
  app.patch("/api/bids/:bidId/complete", completeBid);

  return app;
}
