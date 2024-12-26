import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { publicationId } = req.query;

  try {
    const [comments, count] = await Promise.all([
      prisma.comments.findMany({
        where: {
          publicationId: publicationId as string,
        },
        include: {
          employee: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
              photo: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.comments.count({
        where: {
          publicationId: publicationId as string,
        },
      }),
    ]);

    return res.status(200).json({ comments, count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default authMiddleware(handler);
