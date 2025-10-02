import { Request, Response } from 'express';
import { bidQueries, campaignQueries, userQueries, notificationQueries } from '../../shared/db/queries';

// Create a new bid
export const createBid = async (req: Request, res: Response) => {
  try {
    const { campaignId, influencerId, proposedRate, message } = req.body;

    // Validate required fields
    if (!campaignId || !influencerId || !proposedRate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify campaign exists and is active
    const campaign = await campaignQueries.getById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }
    if (campaign.status !== 'active') {
      return res.status(400).json({ error: 'Campaign is not active' });
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

    // Create notification for business owner
    await notificationQueries.create({
      userId: campaign.businessId,
      title: 'New Bid Received',
      message: `${influencer.firstName} ${influencer.lastName} has submitted a bid for your campaign "${campaign.title}"`,
      type: 'bid_received',
      relatedId: bid.id,
      relatedType: 'bid',
    });

    res.status(201).json({
      bid,
      message: 'Bid submitted successfully',
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
    res.json({ bids });
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
    res.json({ bids });
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

    // Update bid status
    const updatedBid = await bidQueries.updateStatus(bidId, status);

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