import { Request, Response } from 'express';
import { bidQueries, campaignQueries, userQueries, notificationQueries } from '../../shared/db/queries';
import { db } from '../../shared/db/connection';
import { bids } from '../../shared/db/schema';
import { eq } from 'drizzle-orm';

// Create a new bid
export const createBid = async (req: Request, res: Response) => {
  try {
    const { campaignId, influencerId, proposedRate, message } = req.body;

    // Validate required fields
    if (!campaignId || !influencerId || !proposedRate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify campaign exists and is accepting bids
    const campaign = await campaignQueries.getById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    if (campaign.status !== 'bid') {
      return res.status(400).json({ error: 'Campaign is not accepting bids' });
    }

    // Verify influencer exists
    const influencer = await userQueries.getById(influencerId);
    if (!influencer || influencer.userType !== 'influencer') {
      return res.status(400).json({ error: 'Invalid influencer ID' });
    }

    // Create bid
    const bid = await bidQueries.create({
      campaignId,
      influencerId,
      proposedRate,
      message,
    });

    // Check if auto-accept is enabled
    let finalBid = bid;
    let autoAccepted = false;

    if (campaign.autoAcceptBids) {
      // Get count of already accepted bids for this campaign
      const acceptedBids = await bidQueries.getAcceptedBidsByCampaignId(campaignId);
      const acceptedCount = acceptedBids.length;

      // Check if under max influencers limit
      const maxInfluencers = campaign.maxInfluencers || 1;
      if (acceptedCount < maxInfluencers) {
        // Auto-accept the bid with timestamp
        const [acceptedBid] = await db
          .update(bids)
          .set({
            status: 'accepted',
            respondedAt: new Date(),
            acceptedAt: new Date(),
            updatedAt: new Date()
          })
          .where(eq(bids.id, bid.id))
          .returning();
        finalBid = acceptedBid;
        autoAccepted = true;

        // Create notification for influencer about auto-acceptance
        await notificationQueries.create({
          userId: influencer.id,
          title: 'Bid Automatically Accepted',
          message: `Your bid for campaign "${campaign.title}" has been automatically accepted!`,
          type: 'bid_accepted',
          relatedId: bid.id,
          relatedType: 'bid',
        });
      }
    }

    // Create notification for business owner
    await notificationQueries.create({
      userId: campaign.businessId,
      title: autoAccepted ? 'Bid Auto-Accepted' : 'New Bid Received',
      message: autoAccepted
        ? `Bid from ${influencer.firstName} ${influencer.lastName} was automatically accepted for campaign "${campaign.title}"`
        : `${influencer.firstName} ${influencer.lastName} has submitted a bid for your campaign "${campaign.title}"`,
      type: autoAccepted ? 'bid_accepted' : 'bid_received',
      relatedId: bid.id,
      relatedType: 'bid',
    });

    res.status(201).json({
      bid: finalBid,
      message: autoAccepted
        ? 'Bid submitted and automatically accepted!'
        : 'Bid submitted successfully',
      autoAccepted,
    });
  } catch (error) {
    console.error('Create bid error:', error);
    if (error.message?.includes('unique constraint')) {
      return res.status(400).json({ error: 'You have already bid on this campaign' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get bids by influencer ID
export const getInfluencerBids = async (req: Request, res: Response) => {
  try {
    const { influencerId } = req.params;

    const bids = await bidQueries.getByInfluencerId(influencerId);

    // Fetch campaign details for each bid
    const bidsWithCampaigns = await Promise.all(
      bids.map(async (bid) => {
        const campaign = await campaignQueries.getById(bid.campaignId);
        return {
          ...bid,
          campaign,
        };
      })
    );

    res.json({ bids: bidsWithCampaigns });
  } catch (error) {
    console.error('Get influencer bids error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get bids by campaign ID
export const getCampaignBids = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const bids = await bidQueries.getByCampaignId(campaignId);

    // Fetch influencer and campaign details for each bid
    const bidsWithDetails = await Promise.all(
      bids.map(async (bid) => {
        const influencer = await userQueries.getById(bid.influencerId);
        const campaign = await campaignQueries.getById(bid.campaignId);
        return {
          ...bid,
          influencer,
          campaign,
        };
      })
    );

    res.json({ bids: bidsWithDetails });
  } catch (error) {
    console.error('Get campaign bids error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update bid status (accept/reject)
export const updateBidStatus = async (req: Request, res: Response) => {
  try {
    const { bidId } = req.params;
    const { status, businessId } = req.body; // businessId for authorization

    // Validate status
    const validStatuses = ['accepted', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Get bid and verify business ownership
    const bid = await bidQueries.getById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Get campaign to verify business ownership
    const campaign = await campaignQueries.getById(bid.campaignId);
    if (!campaign || campaign.businessId !== businessId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Update bid status with timestamp
    const updateData: any = {
      status,
      respondedAt: new Date(),
      updatedAt: new Date()
    };

    // Add acceptedAt timestamp when accepting
    if (status === 'accepted') {
      updateData.acceptedAt = new Date();
    }

    const [updatedBid] = await db
      .update(bids)
      .set(updateData)
      .where(eq(bids.id, bidId))
      .returning();

    // Get influencer info for notification
    const influencer = await userQueries.getById(bid.influencerId);

    // Create notification for influencer
    await notificationQueries.create({
      userId: bid.influencerId,
      title: `Bid ${status === 'accepted' ? 'Accepted' : 'Rejected'}`,
      message: `Your bid for campaign "${campaign.title}" has been ${status}`,
      type: `bid_${status}`,
      relatedId: bid.id,
      relatedType: 'bid',
    });

    res.json({
      bid: updatedBid,
      message: `Bid ${status} successfully`,
    });
  } catch (error) {
    console.error('Update bid status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark work as started
export const startWork = async (req: Request, res: Response) => {
  try {
    const { bidId } = req.params;
    const { influencerId } = req.body;

    // Get bid and verify influencer ownership
    const bid = await bidQueries.getById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (bid.influencerId !== influencerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (bid.status !== 'accepted') {
      return res.status(400).json({ error: 'Can only start work on accepted bids' });
    }

    // Update work started timestamp
    const [updatedBid] = await db
      .update(bids)
      .set({
        workStartedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(bids.id, bidId))
      .returning();

    res.json({
      bid: updatedBid,
      message: 'Work started successfully',
    });
  } catch (error) {
    console.error('Start work error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mark bid as completed (when work is done)
export const completeBid = async (req: Request, res: Response) => {
  try {
    const { bidId } = req.params;
    const { influencerId } = req.body; // influencerId for authorization

    // Get bid and verify influencer ownership
    const bid = await bidQueries.getById(bidId);
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (bid.influencerId !== influencerId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (bid.status !== 'accepted') {
      return res.status(400).json({ error: 'Bid must be accepted before it can be completed' });
    }

    // Update bid status to completed
    const updatedBid = await bidQueries.updateStatus(bidId, 'completed');

    // Get campaign info for notification
    const campaign = await campaignQueries.getById(bid.campaignId);

    // Create notification for business owner
    if (campaign) {
      await notificationQueries.create({
        userId: campaign.businessId,
        title: 'Campaign Work Completed',
        message: `Work for campaign "${campaign.title}" has been marked as completed`,
        type: 'work_completed',
        relatedId: bid.id,
        relatedType: 'bid',
      });
    }

    res.json({
      bid: updatedBid,
      message: 'Bid marked as completed successfully',
    });
  } catch (error) {
    console.error('Complete bid error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};