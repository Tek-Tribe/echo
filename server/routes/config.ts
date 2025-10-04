import { Request, Response } from 'express';
import { db } from '../../shared/db/connection';
import { echoConfig } from '../../shared/db/schema';

export const getEchoConfig = async (_req: Request, res: Response) => {
  try {
    const configs = await db.select().from(echoConfig).limit(1);
    const config = configs[0];

    if (!config) {
      // Return default config if none exists
      return res.json({
        config: {
          partnershipNotificationEmail: null,
          defaultCurrency: 'INR',
          timezone: 'UTC',
          platformName: 'Echo Platform',
        }
      });
    }

    res.json({ config });
  } catch (error) {
    console.error('Error fetching echo config:', error);
    res.status(500).json({ error: 'Failed to fetch echo config' });
  }
};

export const updateEchoConfig = async (req: Request, res: Response) => {
  try {
    const { partnershipNotificationEmail, defaultCurrency, timezone, platformName, updatedBy } = req.body;

    // Check if config exists
    const configs = await db.select().from(echoConfig).limit(1);
    const existingConfig = configs[0];

    let config;

    if (existingConfig) {
      // Update existing config
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (partnershipNotificationEmail !== undefined) {
        updateData.partnershipNotificationEmail = partnershipNotificationEmail;
      }
      if (defaultCurrency !== undefined) {
        updateData.defaultCurrency = defaultCurrency;
      }
      if (timezone !== undefined) {
        updateData.timezone = timezone;
      }
      if (platformName !== undefined) {
        updateData.platformName = platformName;
      }
      if (updatedBy !== undefined) {
        updateData.updatedBy = updatedBy;
      }

      [config] = await db
        .update(echoConfig)
        .set(updateData)
        .where(db.$with('_').as(db.select().from(echoConfig).limit(1)))
        .returning();

      // If update didn't work with the where clause, try updating by ID
      if (!config) {
        [config] = await db
          .update(echoConfig)
          .set(updateData)
          .returning();
      }
    } else {
      // Create new config
      [config] = await db
        .insert(echoConfig)
        .values({
          partnershipNotificationEmail: partnershipNotificationEmail || null,
          defaultCurrency: defaultCurrency || 'INR',
          timezone: timezone || 'UTC',
          platformName: platformName || 'Echo Platform',
          updatedBy,
        })
        .returning();
    }

    res.json({
      success: true,
      message: 'Echo configuration updated successfully',
      config
    });
  } catch (error) {
    console.error('Error updating echo config:', error);
    res.status(500).json({ error: 'Failed to update echo config' });
  }
};

export const getPartnershipEmail = async (_req: Request, res: Response) => {
  try {
    const configs = await db.select().from(echoConfig).limit(1);
    const config = configs[0];

    if (!config || !config.partnershipNotificationEmail) {
      return res.status(404).json({ error: 'Partnership notification email not configured' });
    }

    res.json({
      email: config.partnershipNotificationEmail,
      config: {
        partnershipNotificationEmail: config.partnershipNotificationEmail
      }
    });
  } catch (error) {
    console.error('Error fetching partnership email:', error);
    res.status(500).json({ error: 'Failed to fetch partnership email' });
  }
};

export const updatePartnershipEmail = async (req: Request, res: Response) => {
  try {
    const { email, updatedBy } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Check if config exists
    const configs = await db.select().from(echoConfig).limit(1);
    const existingConfig = configs[0];

    let config;

    if (existingConfig) {
      // Update existing config - just update the first record
      const allConfigs = await db.select().from(echoConfig);
      if (allConfigs.length > 0) {
        [config] = await db
          .update(echoConfig)
          .set({
            partnershipNotificationEmail: email,
            updatedAt: new Date(),
            updatedBy,
          })
          .returning();
      }
    } else {
      // Create new config
      [config] = await db
        .insert(echoConfig)
        .values({
          partnershipNotificationEmail: email,
          updatedBy,
        })
        .returning();
    }

    res.json({
      success: true,
      message: 'Partnership notification email updated successfully',
      config: {
        partnershipNotificationEmail: config?.partnershipNotificationEmail
      }
    });
  } catch (error) {
    console.error('Error updating partnership email:', error);
    res.status(500).json({ error: 'Failed to update partnership email' });
  }
};
