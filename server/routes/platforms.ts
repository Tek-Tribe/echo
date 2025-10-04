import { Request, Response } from 'express';
import { platformQueries } from '../../shared/db/queries';

// Get all active platforms
export const getPlatforms = async (req: Request, res: Response) => {
  try {
    const platforms = await platformQueries.getActive();
    res.json({ platforms });
  } catch (error) {
    console.error('Get platforms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
