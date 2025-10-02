import { Request, Response } from 'express';
import { campaignQueries, bidQueries, platformQueries, userQueries } from '../../shared/db/queries';

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const {
      businessId,
      platformName = 'instagram',
      title,
      description,
      campaignType,
      budget,
      contentUrl,
      requirements,
      targetAudience,
      startDate,
      endDate,
    } = req.body;

    // Validate required fields
    if (!businessId || !title || !campaignType || !budget) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify business user exists
    const business = await userQueries.getById(businessId);
    if (!business || business.userType !== 'business') {
      return res.status(400).json({ error: 'Invalid business ID' });
    }

    // Get platform ID
    const platform = await platformQueries.getByName(platformName);
    if (!platform) {
      return res.status(400).json({ error: 'Invalid platform' });
    }

    // Create campaign
    const campaign = await campaignQueries.create({
      businessId,
      platformId: platform.id,
      title,
      description,
      campaignType,
      budget,
      contentUrl,
      requirements,
      targetAudience,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
    });

    res.status(201).json({
      campaign,
      message: 'Campaign created successfully',
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all active campaigns
export const getActiveCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await campaignQueries.getActiveCampaigns();
    res.json({ campaigns });
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get campaigns by business ID
export const getBusinessCampaigns = async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    const campaigns = await campaignQueries.getByBusinessId(businessId);
    res.json({ campaigns });
  } catch (error) {
    console.error('Get business campaigns error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get campaign by ID with bids
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;

    const campaign = await campaignQueries.getById(campaignId);
    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    // Get bids for this campaign
    const bids = await bidQueries.getByCampaignId(campaignId);

    res.json({
      campaign,
      bids,
    });
  } catch (error) {
    console.error('Get campaign by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update campaign
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated directly
    const { id, businessId, createdAt, ...allowedUpdates } = updateData;

    const campaign = await campaignQueries.update(campaignId, allowedUpdates);

    res.json({
      campaign,
      message: 'Campaign updated successfully',
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update campaign status
export const updateCampaignStatus = async (req: Request, res: Response) => {
  try {
    const { campaignId } = req.params;
    const { status } = req.body;

    const validStatuses = ['draft', 'active', 'paused', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const campaign = await campaignQueries.update(campaignId, { status });

    res.json({
      campaign,
      message: 'Campaign status updated successfully',
    });
  } catch (error) {
    console.error('Update campaign status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};