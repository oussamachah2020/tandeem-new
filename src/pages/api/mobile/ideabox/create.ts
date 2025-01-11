import { NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { constants } from "http2";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = req?.user;
  const { title, description, isAnonymous } = req.body;

  if (user) {
    const targetEmployee = await prisma.user.findUnique({
      where: { id: user?.id },
      include: { employee: { select: { id: true } } },
    });

    if (targetEmployee && targetEmployee.employee) {
      const createdIdea = await prisma.ideaBox.create({
        data: {
          title,
          description,
          employeeId: targetEmployee?.employee?.id,
          isAnonymous: isAnonymous || false,
        },
      });

      res
        .status(constants.HTTP_STATUS_OK)
        .json({ message: "data inserted successfully", idea: createdIdea });
    } else {
      res
        .status(constants.HTTP_STATUS_NOT_FOUND)
        .json({ message: "Employee not found" });
    }
  }
}

export default authMiddleware(handler);
