import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { commentId, text, publicationId } = req.body;
    const user = req?.user;

    try {
      if (!commentId) {
        await prisma.comments.create({
          data: {
            text,
            publicationId: publicationId as string,
            employeeId: user?.id as string,
          },
        });
        return res.status(201).json({ message: "Comment added successfully" });
      } else {
        await prisma.comments.update({
          where: {
            id: commentId,
          },
          data: {
            text,
          },
        });
        return res
          .status(201)
          .json({ message: "Comment updated successfully" });
      }
    } catch (error) {
      console.error("Error upserting comment:", error);
      return res.status(500).json({ message: "Failed to process the request" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

export default authMiddleware(handler);