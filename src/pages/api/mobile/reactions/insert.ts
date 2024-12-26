import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { reactionId, publicationId, type } = req.body;

    const user = req?.user;

    try {
      if (!reactionId) {
        await prisma.reactions.create({
          data: {
            type,
            publicationId: publicationId as string,
            employeeId: user?.id as string,
          },
        });
        return res.status(201).json({ message: "Reaction added successfully" });
      } else {
        await prisma.reactions.update({
          where: {
            id: reactionId,
          },
          data: {
            type,
          },
        });
        return res
          .status(201)
          .json({ message: "Reaction updated successfully" });
      }
    } catch (error) {
      console.error("Error upserting comment:", error);
      return res.status(500).json({ message: "Failed to process the request" });
    }
  }
}

export default authMiddleware(handler);
