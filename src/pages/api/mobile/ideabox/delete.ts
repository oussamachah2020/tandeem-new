import { NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { constants } from "http2";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = req.user;

  const { ideaId } = req.query;

  const activeEmployee = await prisma.user.findUnique({
    where: { id: user?.id },
    include: { employee: { select: { id: true } } },
  });

  if (activeEmployee && activeEmployee.employee) {
    const employeeOwnsIdea = await prisma.ideaBox.count({
      where: {
        id: ideaId as string,
        employeeId: activeEmployee.employee.id,
      },
    });
    if (employeeOwnsIdea) {
      await prisma.ideaBox.delete({ where: { id: ideaId as string } });
      res
        .status(constants.HTTP_STATUS_OK)
        .json({ message: "Data removed succesfully" });
    } else {
      res
        .status(constants.HTTP_STATUS_FORBIDDEN)
        .json({ message: "Not allowed" });
    }
  } else {
    res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .json({ message: "Data not found" });
  }
}

export default authMiddleware(handler);
