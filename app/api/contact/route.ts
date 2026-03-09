import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

// Validate environment variables
const getEmailConfig = () => {
  const email = 'proautocarep@gmail.com';
  const password = 'pwrsyeiipevvbnmp';
  const host =  'smtp.gmail.com';
  const port = parseInt('587');

  if (!email || !password) {
    throw new Error('SMTP_EMAIL and SMTP_PASSWORD environment variables are required');
  }

  return { email, password, host, port };
};

// Create transporter
const createTransporter = () => {
  const config = getEmailConfig();
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465, // true for 465, false for other ports
    auth: {
      user: config.email,
      pass: config.password,
    },
  });
};

interface ContactFormData {
  fullName: string;
  phone: string;
  email: string;
  service: string;
  location: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Validate required fields
    const { fullName, phone, email, service, location, message } = body;

    if (!fullName || !phone || !email || !service || !location || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const transporter = createTransporter();
    const config = getEmailConfig();

    // Email to business owner
    const businessMailOptions = {
      from: config.email,
      to: config.email,
      subject: `New Service Request from ${fullName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">New Service Request</h1>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px;">
            <p><strong>Customer Name:</strong> ${fullName}</p>
            <p><strong>Phone Number:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Service Needed:</strong> ${service}</p>
            <p><strong>Location:</strong> ${location}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; color: #333;">${message}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 12px; color: #666;">
              This request was received on ${new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' })}
            </p>
          </div>
        </div>
      `,
    };

    // Confirmation email to customer
    const customerMailOptions = {
      from: config.email,
      to: email,
      subject: 'Service Request Confirmation - AutoFix Pro',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0;">Service Request Received</h1>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 0 0 10px 10px;">
            <p>Dear ${fullName},</p>
            <p>Thank you for choosing AutoFix Pro! We have received your service request and our team will contact you shortly.</p>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
              <p style="margin: 5px 0;"><strong>Service Requested:</strong> ${service}</p>
              <p style="margin: 5px 0;"><strong>Location:</strong> ${location}</p>
              <p style="margin: 5px 0;"><strong>Request ID:</strong> ${Date.now()}</p>
            </div>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>Our team will review your request immediately</li>
              <li>We will call you at ${phone} within the next 30 minutes during business hours</li>
              <li>For emergencies (24/7), you can always call us directly</li>
            </ul>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 14px;">
              <strong>Contact Us:</strong><br>
              📞 Emergency Hotline: (056) 730-4650<br>
              📧 Email: proautocarep@gmail.com<br>
              📍 Service Area: Abu Dhabi, UAE
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              Best regards,<br>
              <strong>AutoFix Pro Team</strong>
            </p>
          </div>
        </div>
      `,
    };

    // Send both emails
    await Promise.all([
      transporter.sendMail(businessMailOptions),
      transporter.sendMail(customerMailOptions),
    ]);

    return NextResponse.json(
      { 
        success: true,
        message: 'Service request submitted successfully. We will contact you shortly!',
        requestId: Date.now(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Contact form error:', error);

    if (error instanceof Error && error.message.includes('SMTP')) {
      return NextResponse.json(
        { error: 'Email service is not configured properly. Please try calling us directly.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit service request. Please try again or call us directly.' },
      { status: 500 }
    );
  }
}
