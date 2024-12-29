import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { customerId } = req.body;

    const departments = await prisma.department.findMany({
      where: {
        customerId,
      },
    });

    return res.status(200).json(departments);
  } catch (error) {
    return res.status(500).json({ message: error });
  }
}
