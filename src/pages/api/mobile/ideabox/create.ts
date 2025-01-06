import {NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const user = req?.user;
  const { description, title } = req.body;
  if (user) {
    const employee = await prisma.employee.findUnique({
      where: { id: user?.id },
    });
    if (employee) {
      await prisma.ideaBox.create({
        data: {
          title,
          description,
          employeeId: employee.id,
        },
      });
      res.status(constants.HTTP_STATUS_OK).end();
    } else {
      res.status(constants.HTTP_STATUS_NOT_FOUND).end();
    }
  }
}

export default authMiddleware(handler);