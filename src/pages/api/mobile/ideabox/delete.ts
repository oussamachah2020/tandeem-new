import {NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req.user;
  const { id: ideaId } = req.body;
  const employee = await prisma.employee.findUnique({
    where: { id: user?.id },
  });
  if (employee) {
    const employeeOwnsIdea = await prisma.ideaBox.count({
      where: {
        id: ideaId,
        employeeId: employee.id,
      },
    });
    if (employeeOwnsIdea) {
      await prisma.ideaBox.delete({ where: { id: ideaId } });
      res.status(constants.HTTP_STATUS_OK).end();
    } else {
      res.status(constants.HTTP_STATUS_FORBIDDEN).end();
    }
  } else {
    res.status(constants.HTTP_STATUS_NOT_FOUND).end();
  }
}

export default authMiddleware(handler);