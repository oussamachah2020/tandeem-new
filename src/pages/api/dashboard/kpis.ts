import { NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { Role } from "@prisma/client";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { customerId } = req.body;

  const user = req.user!;
  const kpis = {
    admins: -1,
    customers: -1,
    partners: -1,
    offers: -1,
    publications: -1,
    medias: -1,
    employees: -1,
    acceptedOffers: -1,
    awaitingOffers: -1,
    ideaBox: -1,
  };

  try {
    // TANDEEM level access
    if (user.role === Role.TANDEEM) {
      kpis.admins = await prisma.admin.count({
        where: { user: { customer: { is: null } } },
      });
      kpis.customers = await prisma.customer.count();
      kpis.partners = await prisma.partner.count();
      kpis.offers = await prisma.offer.count({
        where: { customer: { is: null } },
      });
      kpis.publications = await prisma.publication.count({
        where: { customer: { is: null } },
      });
      kpis.medias = await prisma.mediaLibrary.count({
        where: { customer: { is: null } },
      });
      kpis.employees = await prisma.employee.count();

      return res.status(200).json({ kpis });
    }

    // Customer or Tandeem level access
    if (user.role === Role.CUSTOMER) {
      if (customerId) {
        kpis.admins = await prisma.admin.count({
          where: { user: { customerId } },
        });
        kpis.employees = await prisma.employee.count({
          where: { customerId },
        });
        kpis.offers = await prisma.offer.count({
          where: { customerId },
        });
        kpis.acceptedOffers = await prisma.offer.count({
          where: {
            customerId,
            acceptedBy: { some: { customerId } },
          },
        });
        kpis.awaitingOffers = await prisma.offer.count({
          where: {
            customer: { is: null },
            acceptedBy: { every: { customerId: { not: customerId } } },
          },
        });
        kpis.publications = await prisma.publication.count({
          where: { customerId },
        });
        kpis.medias = await prisma.mediaLibrary.count({
          where: { customerId },
        });
        kpis.ideaBox = await prisma.ideaBox.count({
          where: { employee: { customerId } },
        });
      }
    }

    // Employee level access
    if (user.role === Role.EMPLOYEE) {
      if (customerId) {
        kpis.offers = await prisma.offer.count({
          where: { customerId },
        });
        kpis.publications = await prisma.publication.count({
          where: { customerId },
        });
        kpis.ideaBox = await prisma.ideaBox.count({
          where: { employee: { customerId } },
        });
      }
    }

    return res.status(200).json({ kpis });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    return res.status(500).json({ error: "Error fetching KPIs" });
  }
};

export default authMiddleware(handler);
