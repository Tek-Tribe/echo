import { Request, Response } from 'express';
import { db } from '../../shared/db/connection';
import { partnershipApplications, echoConfig } from '../../shared/db/schema';
import { sendEmail } from '../email';

export const submitPartnershipApplication = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, instagramHandle, instagramFollowers, niche, location, bio } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !instagramHandle) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email, and instagramHandle are required'
      });
    }

    // Insert partnership application into database
    const [application] = await db.insert(partnershipApplications).values({
      firstName,
      lastName,
      email,
      phone,
      instagramHandle,
      instagramFollowers: instagramFollowers ? parseInt(instagramFollowers) : null,
      niche,
      location,
      bio,
      status: 'pending',
    }).returning();

    // Get configured email address from echo config
    const configs = await db.select().from(echoConfig).limit(1);
    const config = configs[0];
    const notificationEmail = config?.partnershipNotificationEmail;

    // Send notification email if configured
    if (notificationEmail) {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #4F46E5;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #f9fafb;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .field-group {
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                margin: 15px 0;
              }
              .field {
                margin: 10px 0;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .field:last-child {
                border-bottom: none;
              }
              .field-label {
                font-weight: bold;
                color: #4F46E5;
                display: inline-block;
                min-width: 150px;
              }
              .field-value {
                color: #333;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 12px;
                color: #6b7280;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>New Partnership Application</h1>
            </div>
            <div class="content">
              <p>A new influencer has submitted a partnership application.</p>

              <div class="field-group">
                <h3 style="margin-top: 0; color: #4F46E5;">Personal Information</h3>
                <div class="field">
                  <span class="field-label">Name:</span>
                  <span class="field-value">${firstName} ${lastName}</span>
                </div>
                <div class="field">
                  <span class="field-label">Email:</span>
                  <span class="field-value">${email}</span>
                </div>
                ${phone ? `
                <div class="field">
                  <span class="field-label">Phone:</span>
                  <span class="field-value">${phone}</span>
                </div>
                ` : ''}
              </div>

              <div class="field-group">
                <h3 style="margin-top: 0; color: #4F46E5;">Instagram Details</h3>
                <div class="field">
                  <span class="field-label">Handle:</span>
                  <span class="field-value">${instagramHandle}</span>
                </div>
                ${instagramFollowers ? `
                <div class="field">
                  <span class="field-label">Followers:</span>
                  <span class="field-value">${parseInt(instagramFollowers).toLocaleString()}</span>
                </div>
                ` : ''}
                ${niche ? `
                <div class="field">
                  <span class="field-label">Niche:</span>
                  <span class="field-value">${niche}</span>
                </div>
                ` : ''}
                ${location ? `
                <div class="field">
                  <span class="field-label">Location:</span>
                  <span class="field-value">${location}</span>
                </div>
                ` : ''}
              </div>

              ${bio ? `
              <div class="field-group">
                <h3 style="margin-top: 0; color: #4F46E5;">About</h3>
                <p style="margin: 0; color: #333; white-space: pre-wrap;">${bio}</p>
              </div>
              ` : ''}

              <div class="footer">
                <p>This is an automated notification from the Echo Platform partnership system.</p>
                <p>Application ID: ${application.id}</p>
                <p>&copy; ${new Date().getFullYear()} Echo Platform. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;

      await sendEmail({
        to: notificationEmail,
        subject: `New Partnership Application from ${firstName} ${lastName}`,
        html: emailHtml,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Partnership application submitted successfully',
      applicationId: application.id
    });
  } catch (error) {
    console.error('Error submitting partnership application:', error);
    res.status(500).json({ error: 'Failed to submit partnership application' });
  }
};

export const getPartnershipApplications = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    let query = db.select().from(partnershipApplications);

    if (status) {
      query = query.where(eq(partnershipApplications.status, status as string));
    }

    const applications = await query;

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching partnership applications:', error);
    res.status(500).json({ error: 'Failed to fetch partnership applications' });
  }
};

export const updatePartnershipApplication = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes, reviewedBy } = req.body;

    const [updatedApplication] = await db
      .update(partnershipApplications)
      .set({
        status,
        notes,
        reviewedBy,
        reviewedAt: new Date(),
      })
      .where(eq(partnershipApplications.id, id))
      .returning();

    if (!updatedApplication) {
      return res.status(404).json({ error: 'Partnership application not found' });
    }

    res.json({
      success: true,
      message: 'Partnership application updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Error updating partnership application:', error);
    res.status(500).json({ error: 'Failed to update partnership application' });
  }
};
