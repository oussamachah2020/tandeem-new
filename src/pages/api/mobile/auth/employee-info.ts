import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { PrismaClient } from "@prisma/client";
import { NextApiResponse } from "next";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const user = req.user;

    console.log(user);

    const employee = await prisma.employee.findUnique({
      where: {
        userId: user?.id,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        photo: true,
        department: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            role: true,
            createdAt: true,
          },
        },
        customer: {
          select: {
            name: true,
            logo: true,
            category: true,
          },
        },
      },
    });

    return res.status(200).json(employee);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export default authMiddleware(handler);
