import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { title, customerId } = req.body;

    await prisma.department.create({
      data: {
        title,
        customerId,
      },
    });

    return res.status(201).json({ message: "department created" });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
