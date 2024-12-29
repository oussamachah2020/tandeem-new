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
    const [reactions, count] = await Promise.all([
      prisma.reactions.findMany({
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
            },
          },
        },
      }),
      prisma.reactions.count({
        where: {
          publicationId: publicationId as string,
        },
      }),
    ]);

    return res.status(200).json({ reactions, count });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default authMiddleware(handler);
