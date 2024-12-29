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
    }
}

// /api/media?id=123&tandeemPage=2&customerPage=1&limit=20

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
    const {
      id,
      tandeemPage = "1",
      customerPage = "1",
      limit = "10",
    } = req.query;

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

    const employee = await prisma.employee.findUnique({ where: { id } });
    
    if (employee) {
      // Get total counts for pagination metadata
      const totalTandeemMedia = await prisma.mediaLibrary.count({
        where: { customer: { is: null } },
      });

      const totalCustomerMedia = await prisma.mediaLibrary.count({
        where: { customerId: employee.customerId },
      });

      // Fetch paginated tandeem media
      const tandeemMedia = await prisma.mediaLibrary.findMany({
        where: { customer: { is: null } },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: SortOrder.desc }],
        skip: tandeemSkip,
        take: limitNumber,
      });

      // Fetch paginated customer media
      const customerMedia = await prisma.mediaLibrary.findMany({
        where: { customerId: employee.customerId },
        select: {
          id: true,
          title: true,
          description: true,
          url: true,
          createdAt: true,
        },
        orderBy: [{ createdAt: SortOrder.desc }],
        skip: customerSkip,
        take: limitNumber,
      });

      // Calculate pagination metadata for both queries
      const tandeemTotalPages = Math.ceil(totalTandeemMedia / limitNumber);
      const customerTotalPages = Math.ceil(totalCustomerMedia / limitNumber);

      const response = {
        tandeem: {
          data: tandeemMedia,
          pagination: {
            currentPage: tandeemPageNumber,
            totalPages: tandeemTotalPages,
            totalItems: totalTandeemMedia,
            itemsPerPage: limitNumber,
            hasNextPage: tandeemPageNumber < tandeemTotalPages,
            hasPreviousPage: tandeemPageNumber > 1,
          },
        },
        customer: {
          data: customerMedia,
          pagination: {
            currentPage: customerPageNumber,
            totalPages: customerTotalPages,
            totalItems: totalCustomerMedia,
            itemsPerPage: limitNumber,
            hasNextPage: customerPageNumber < customerTotalPages,
            hasPreviousPage: customerPageNumber > 1,
          },
        },
      };

      res.json(response);
    } else {
        res.status(constants.HTTP_STATUS_NOT_FOUND).end()
    }
}