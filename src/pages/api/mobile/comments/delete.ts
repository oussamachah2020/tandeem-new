import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { commentId } = req.query;

  try {
    await prisma.comments.delete({
      where: {
        id: commentId as string,
      },
    });
    return res.status(200).json({ message: "Comment removed successfully" });
  } catch (error) {
    console.error(error);
  }
}

export default authMiddleware(handler);
