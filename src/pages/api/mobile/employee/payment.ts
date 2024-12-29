import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { amount, currency, userId, offerId } = req.body;

    if (!amount || !currency || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Create a new payment record in the database
      const payment = await prisma.offer.update({
        where: {
          id: offerId,
        },
        data: {
          paymentDetails: {
            amount,
            currency,
            userId,
            status: "pending",
          },
        },
      });

      // Call YouCan Pay API to create a payment session
      const response = await fetch(
        "https://api.youcanpay.com/payment-session",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.YOUCANPAY_PRIVATE_KEY!}`, // Replace with your key
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount,
            currency,
            order_id: payment.id,
            // redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/success`,
            // cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment/cancel`,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res
          .status(400)
          .json({ error: data.message || "Payment session creation failed" });
      }

      // Return the payment URL to the client
      res.status(200).json({ payment_url: data.payment_url });
    } catch (error) {
      console.error("Error creating payment:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
