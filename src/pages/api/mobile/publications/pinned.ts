import { authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const pinnedPublications = await prisma.publication.findMany({
      where: { pinned: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(pinnedPublications);
  } catch (error) {
    console.error("Error fetching pinned publications:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export default authMiddleware(handler);
