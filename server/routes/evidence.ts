import { Request, Response } from 'express';
import { db } from '../../shared/db/connection';
import { evidenceSubmissions, bids } from '../../shared/db/schema';
import { eq } from 'drizzle-orm';

// Submit evidence for a bid
export const submitEvidence = async (req: Request, res: Response) => {
  try {
    const { bidId, evidenceUrl, evidenceType, description } = req.body;

    // Validate required fields
    if (!bidId || !evidenceUrl || !evidenceType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Verify bid exists and is accepted
    const [bid] = await db.select().from(bids).where(eq(bids.id, bidId));
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (bid.status !== 'accepted') {
      return res.status(400).json({ error: 'Evidence can only be submitted for accepted bids' });
    }

    // Create evidence submission
    const [evidence] = await db.insert(evidenceSubmissions).values({
      bidId,
      evidenceUrl,
      evidenceType,
      description,
    }).returning();

    // Update bid with evidence submitted timestamp
    await db
      .update(bids)
      .set({
        evidenceSubmittedAt: new Date(),
        updatedAt: new Date()
      })
      .where(eq(bids.id, bidId));

    res.status(201).json({
      evidence,
      message: 'Evidence submitted successfully'
    });
  } catch (error) {
    console.error('Submit evidence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get evidence submissions for a bid
export const getBidEvidence = async (req: Request, res: Response) => {
  try {
    const { bidId } = req.params;

    const evidence = await db
      .select()
      .from(evidenceSubmissions)
      .where(eq(evidenceSubmissions.bidId, bidId));

    res.json({ evidence });
  } catch (error) {
    console.error('Get bid evidence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Confirm evidence (Echo admin/manager only)
export const confirmEvidence = async (req: Request, res: Response) => {
  try {
    const { bidId } = req.params;
    const { isApproved, reviewerNotes } = req.body;

    // Verify bid exists and has evidence submitted
    const [bid] = await db.select().from(bids).where(eq(bids.id, bidId));
    if (!bid) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    if (!bid.evidenceSubmittedAt) {
      return res.status(400).json({ error: 'No evidence submitted for this bid' });
    }

    // Update evidence submission status
    const [evidence] = await db
      .select()
      .from(evidenceSubmissions)
      .where(eq(evidenceSubmissions.bidId, bidId));

    if (evidence) {
      await db
        .update(evidenceSubmissions)
        .set({
          isApproved,
          reviewerNotes,
          reviewedAt: new Date()
        })
        .where(eq(evidenceSubmissions.id, evidence.id));
    }

    // If approved, update bid with confirmation timestamp and complete status
    if (isApproved) {
      await db
        .update(bids)
        .set({
          status: 'completed',
          evidenceConfirmedAt: new Date(),
          updatedAt: new Date()
        })
        .where(eq(bids.id, bidId));
    }

    res.json({
      message: isApproved ? 'Evidence confirmed and payment processed' : 'Evidence rejected',
      bid: await db.select().from(bids).where(eq(bids.id, bidId)).then(r => r[0])
    });
  } catch (error) {
    console.error('Confirm evidence error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
