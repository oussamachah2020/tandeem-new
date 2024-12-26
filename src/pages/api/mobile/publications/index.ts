import {NextApiRequest, NextApiResponse} from 'next'
import prisma from "@/common/libs/prisma";
import {Prisma} from "@prisma/client";
import {constants} from "http2";
import SortOrder = Prisma.SortOrder;

interface TypedNextApiRequest extends NextApiRequest {
  query: {
    id: string;
    tandeemPage?: string;
    customerPage?: string;
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

interface PublicationsResponse {
  tandeem: PaginatedResponse<any>;
  customer: PaginatedResponse<any>;
}

// /api/publications?id=123&tandeemPage=2&customerPage=1&limit=20

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
  const { id, tandeemPage = "1", customerPage = "1", limit = "10" } = req.query;

  // Convert string parameters to numbers
  const tandeemPageNumber = parseInt(tandeemPage, 10);
  const customerPageNumber = parseInt(customerPage, 10);
  const limitNumber = parseInt(limit, 10);

  // Validate pagination parameters
  if (
    isNaN(tandeemPageNumber) ||
    isNaN(customerPageNumber) ||
    isNaN(limitNumber) ||
    tandeemPageNumber < 1 ||
    customerPageNumber < 1 ||
    limitNumber < 1
  ) {
    return res.status(400).json({ error: "Invalid pagination parameters" });
  }

  const tandeemSkip = (tandeemPageNumber - 1) * limitNumber;
  const customerSkip = (customerPageNumber - 1) * limitNumber;

  try {
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).end();
    }

    // Get total counts for pagination metadata
    const totalTandeemPublications = await prisma.publication.count({
      where: { customer: { is: null } },
    });

    const totalCustomerPublications = await prisma.publication.count({
      where: { customerId: employee.customerId },
    });

    // Fetch paginated tandeem publications
    const tandeemPublications = await prisma.publication.findMany({
      where: { customer: { is: null } },
      select: {
        id: true,
        title: true,
        content: true,
        photo: true,
        pinned: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: SortOrder.desc }, { pinned: SortOrder.desc }],
      skip: tandeemSkip,
      take: limitNumber,
    });

    // Fetch paginated customer publications
    const customerPublications = await prisma.publication.findMany({
      where: { customerId: employee.customerId },
      select: {
        id: true,
        title: true,
        content: true,
        photo: true,
        pinned: true,
        createdAt: true,
      },
      orderBy: [{ createdAt: SortOrder.desc }, { pinned: SortOrder.desc }],
      skip: customerSkip,
      take: limitNumber,
    });

    // Calculate pagination metadata for both queries
    const tandeemTotalPages = Math.ceil(totalTandeemPublications / limitNumber);
    const customerTotalPages = Math.ceil(
      totalCustomerPublications / limitNumber
    );

    const response: PublicationsResponse = {
      tandeem: {
        data: tandeemPublications,
        pagination: {
          currentPage: tandeemPageNumber,
          totalPages: tandeemTotalPages,
          totalItems: totalTandeemPublications,
          itemsPerPage: limitNumber,
          hasNextPage: tandeemPageNumber < tandeemTotalPages,
          hasPreviousPage: tandeemPageNumber > 1,
        },
      },
      customer: {
        data: customerPublications,
        pagination: {
          currentPage: customerPageNumber,
          totalPages: customerTotalPages,
          totalItems: totalCustomerPublications,
          itemsPerPage: limitNumber,
          hasNextPage: customerPageNumber < customerTotalPages,
          hasPreviousPage: customerPageNumber > 1,
        },
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching publications:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch publications",
    });
  }
};