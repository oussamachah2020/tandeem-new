import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const { commentId, text, publicationId } = req.body;
    const user = req?.user;

    try {
      const updatedComment = await prisma.comments.update({
        where: {
          id: commentId,
        },
        data: {
          text,
          publicationId: publicationId as string,
          employeeId: user?.id as string,
        },
      });
      return res
        .status(201)
        .json({
          message: "Comment added successfully",
          comment: updatedComment,
        });
    } catch (error) {
      console.error("Error upserting comment:", error);
      return res.status(500).json({ message: "Failed to process the request" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}

export default authMiddleware(handler);
