import {NextApiRequest, NextApiResponse} from "next";
import prisma from "@/common/libs/prisma";
import {constants} from "http2";

interface TypedNextApiRequest extends NextApiRequest {
  query: {
    id: string;
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

// /api/partners?id=123&page=2&limit=20

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
  const { id, page = "1", limit = "10" } = req.query;

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

  try {
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).end();
    }

    // Get total count for pagination metadata
    const totalPartners = await prisma.partner.count({
      where: {
        offers: {
          some: {
            acceptedBy: {
              some: {
                customerId: employee.customerId,
                for: { has: employee.level },
              },
            },
          },
        },
      },
    });

    // Fetch paginated partners
    const partners = await prisma.partner.findMany({
      where: {
        offers: {
          some: {
            acceptedBy: {
              some: {
                customerId: employee.customerId,
                for: { has: employee.level },
              },
            },
          },
        },
      },
      select: {
        id: true,
        name: true,
        logo: true,
      },
      skip,
      take: limitNumber,
      orderBy: {
        name: "asc", // Added default sorting by name
      },
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalPartners / limitNumber);

    const response: PaginatedResponse<(typeof partners)[0]> = {
      data: partners,
      pagination: {
        currentPage: pageNumber,
        totalPages,
        totalItems: totalPartners,
        itemsPerPage: limitNumber,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching partners:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch partners",
    });
  }
};