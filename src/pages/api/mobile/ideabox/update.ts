import { NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { constants } from "http2";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { id, title, description, isAnonymous } = req.body;

  const existingIdeaBox = await prisma.ideaBox.findUnique({
    where: {
      id,
    },
  });

  if (existingIdeaBox) {
    const updatedIdea = await prisma.ideaBox.update({
      where: {
        id,
      },
      data: {
        title,
        description,
        isAnonymous,
      },
    });

    res
      .status(constants.HTTP_STATUS_OK)
      .json({ message: "data updated successfully", idea: updatedIdea });
  } else {
    res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .json({ message: "Data not found" });
  }
}

export default authMiddleware(handler);
