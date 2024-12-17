import type { NextApiRequest, NextApiResponse } from "next";
import twilio from "twilio";

// Load environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  try {
    // Generate a random 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Send the SMS using Twilio
    await client.messages.create({
      body: `Your verification code is: ${verificationCode}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    // Here you can save the verificationCode to your database with expiration time

    return res.status(200).json({
      message: "Verification code sent successfully",
      verificationCode: verificationCode, // You would not expose this in production
    });
  } catch (error) {
    console.error("Twilio Error:", error);
    return res.status(500).json({ error: "Failed to send verification code" });
  }
}
