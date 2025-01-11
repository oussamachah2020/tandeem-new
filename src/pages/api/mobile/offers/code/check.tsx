import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { code, phone } = req.body;

  if (!code || !phone) {
    return res
      .status(400)
      .json({ message: "Offer code and Employee phone are required" });
  }

  try {
    const relatedOffer = await prisma.offer.findFirst({
      where: {
        codePromo: code,
      },
    });

    if (!relatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    const currentDay = new Date();

    if (relatedOffer.to < currentDay) {
      return res.status(400).json({ message: "The offer has expired" });
    }

    const existingCode = await prisma.usedCodesPromo.findFirst({
      where: {
        employeePhone: phone,
        code: code,
      },
    });

    if (existingCode) {
      return res
        .status(400)
        .json({
          message: "This code has already been used by this phone number",
        });
    }

    await prisma.usedCodesPromo.create({
      data: {
        code,
        employeePhone: phone,
        isUsed: true,
        offerId: relatedOffer.id,
      },
    });

    return res.status(200).json({ message: "Code validated successfully!" });
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
