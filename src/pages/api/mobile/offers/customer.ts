import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { OfferStatusName, Prisma } from "@prisma/client";
import { constants } from "http2";
import SortOrder = Prisma.SortOrder;
import staticValues from "@/common/context/StaticValues";

interface TypedNextApiRequest extends NextApiRequest {
  query: {
    id: string;
    page?: string;
  };
}

export default async (req: TypedNextApiRequest, res: NextApiResponse) => {
  const { id, page = "1" } = req.query;
  const pageNumber = parseInt(page, 10);
  const pageSize = 10;
  const skip = (pageNumber - 1) * pageSize;

  try {
    const employee = await prisma.employee.findUnique({ where: { id } });

    if (!employee) {
      return res.status(constants.HTTP_STATUS_NOT_FOUND).end();
    }

    // Fetch customer offers
    const customerOffers = await prisma.offer.findMany({
      where: {
        customerId: employee.customerId,
        status: OfferStatusName.Active,
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        image: true,
        to: true,
        initialPrice: true,
        finalPrice: true,
        discount: true,
        createdAt: true,
        paymentDetails: true,
        isSurvey: true,
      },
      orderBy: { createdAt: SortOrder.desc },
      skip,
      take: pageSize,
    });

    // Fetch surveys for the customer
    const surveys = await prisma.survey.findMany({
      where: {
        customerId: employee.customerId,
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        paul: true,
        isSurvey: true,
        customer: true,
      },
      orderBy: { createdAt: SortOrder.desc },
      skip,
      take: pageSize,
    });

    // Combine customer offers and surveys
    const response = {
      offers: customerOffers.map((result) => ({
        ...result,
        category:
          staticValues.subCategory[
            result.category as keyof typeof staticValues.subCategory
          ],
      })),
      surveys,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching customer offers and surveys:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch customer offers and surveys",
    });
  }
};
