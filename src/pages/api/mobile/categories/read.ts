import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  try {
    const categories = await prisma.categories.findMany();

    return res.status(200).json(categories);
  } catch (error) {
    console.error("Error inserting categories:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while inserting categories." });
  } finally {
    // Clean up Prisma connection
    await prisma.$disconnect();
  }
}
