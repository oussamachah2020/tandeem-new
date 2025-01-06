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

    // Fetch Tandeem offers
    const tandeemOffers = await prisma.acceptedOffer.findMany({
      where: {
        customer: { id: employee.customerId },
        for: { has: employee.level },
        offer: { status: OfferStatusName.Active },
      },
      select: {
        offer: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            image: true,
            initialPrice: true,
            finalPrice: true,
            discount: true,
            to: true,
            partner: {
              select: {
                id: true,
                name: true,
                address: true,
                logo: true,
                website: true,
                category: true,
              },
            },
            createdAt: true,
          },
        },
        pinned: true,
      },
      orderBy: [
        { pinned: SortOrder.desc },
        { offer: { createdAt: SortOrder.desc } },
      ],
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

    // Combine Tandeem offers and surveys
    const response = {
      offers: tandeemOffers.map((result) => ({
        ...result.offer,
        category:
          staticValues.subCategory[
            result.offer.category as keyof typeof staticValues.subCategory
          ],
        pinned: result.pinned,
      })),
      surveys,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching Tandeem offers and surveys:", error);
    res.status(constants.HTTP_STATUS_INTERNAL_SERVER_ERROR).json({
      error: "Failed to fetch Tandeem offers and surveys",
    });
  }
};
