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

  const { categoryId } = req.query;

  try {
    if (categoryId) {
      const subCategories = await prisma.subCategories.findMany({
        where: {
          categoryId: categoryId as string,
        },
      });

      return res.status(200).json(subCategories);
    }
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
