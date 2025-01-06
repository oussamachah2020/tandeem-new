import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { Prisma } from "@prisma/client";
import { constants } from "http2";
import SortOrder = Prisma.SortOrder;
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

interface TypedNextApiRequest extends NextApiRequest {
  query: {
    page?: string;
    limit?: string;
  };
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const { page = "1", limit = "10" } = req.query;

  // Convert string parameters to numbers
  const pageNumber = parseInt(page as string, 10);
  const limitNumber = parseInt(limit as string, 10);

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

  try {
    const user = req?.user;

    const employee = await prisma.employee.findUnique({
      where: { id: user?.id },
    });

    if (!employee) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).end();
    }

    // Get total count for pagination metadata
    const totalCustomerPublications = await prisma.publication.count({
      where: { customerId: employee.customerId },
    });

    // Fetch paginated customer publications
    const customerPublications = await prisma.publication.findMany({
      where: { customerId: employee.customerId },
      select: {
        id: true,
        title: true,
        content: true,
        photos: true,
        pinned: true,
        createdAt: true,
        reactions: {
          select: {
            id: true,
            type: true,
            employee: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
                photo: true,
              },
            },
          },
        },
        _count: {
          select: {
            reactions: true,
          },
        },
      },
      orderBy: [{ createdAt: SortOrder.desc }, { pinned: SortOrder.desc }],
      skip,
      take: limitNumber,
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalCustomerPublications / limitNumber);

    const response: PaginatedResponse<(typeof customerPublications)[0]> = {
      data: customerPublications,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: totalCustomerPublications,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching customer publications:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch customer publications",
    });
  }
}

export default authMiddleware(handler);
