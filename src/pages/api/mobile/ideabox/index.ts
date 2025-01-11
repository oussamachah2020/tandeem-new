import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { constants } from "http2";
import { Prisma } from "@prisma/client";
import SortOrder = Prisma.SortOrder;

interface TypedNextApiRequest extends NextApiRequest {
  query: {
    id: string;
    page?: string;
    limit?: string;
  };
  user?: {
    role: string; // Assuming user object contains a role field
  };
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
  const { id, page = "1", limit = "10" } = req.query;
  const userRole = req.user?.role; // Default role if user is not authenticated

  // Convert string parameters to numbers
  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  // Validate pagination parameters
  if (
    isNaN(pageNumber) ||
    isNaN(limitNumber) ||
    pageNumber < 1 ||
    limitNumber < 1
  ) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  const skip = (pageNumber - 1) * limitNumber;

  // Check if employee exists
  const employee = await prisma.employee.findUnique({ where: { id } });
  if (!employee) {
    return res
      .status(constants.HTTP_STATUS_NOT_FOUND)
      .json({ error: "Employee not found" });
  }

  // Get total count of visible ideas
  const totalIdeas = await prisma.ideaBox.count({
    where: {
      employeeId: id,
      OR: [
        { isAnonymous: false }, // Public ideas
        userRole === "TANDEEM" ? { isAnonymous: true } : {}, // TANDEEM users see anonymous ideas
      ],
    },
  });

  // Fetch paginated ideas with visibility filtering
  const ideas = await prisma.ideaBox.findMany({
    where: {
      employeeId: id,
      OR: [
        { isAnonymous: false }, // Public ideas
        userRole === "TANDEEM" ? { isAnonymous: true } : {}, // TANDEEM users see anonymous ideas
      ],
    },
    select: {
      id: true,
      title: true,
      description: true,
      archived: true,
      createdAt: true,
    },
    orderBy: { createdAt: SortOrder.desc },
    skip,
    take: limitNumber,
  });

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalIdeas / limitNumber);
  const hasNextPage = pageNumber < totalPages;
  const hasPreviousPage = pageNumber > 1;

  res.json({
    data: ideas,
    pagination: {
      currentPage: pageNumber,
      totalPages,
      totalItems: totalIdeas,
      itemsPerPage: limitNumber,
      hasNextPage,
      hasPreviousPage,
    },
  });
};
