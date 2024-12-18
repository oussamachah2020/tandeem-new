import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method Not Allowed" });

  const { role, customerId } = req.body;

  const kpis = {
    admins: 0,
    customers: 0,
    partners: 0,
    offers: 0,
    publications: 0,
    medias: 0,
    employees: 0,
    acceptedOffers: 0,
    awaitingOffers: 0,
    ideaBox: 0,
  };

  try {
    if (role === "TANDEEM") {
      kpis.admins = await prisma.admin.count();
      kpis.customers = await prisma.customer.count();
      kpis.partners = await prisma.partner.count();
      kpis.offers = await prisma.offer.count();
    } else if (role === "CUSTOMER") {
      kpis.employees = await prisma.employee.count({ where: { customerId } });
      kpis.offers = await prisma.offer.count({ where: { customerId } });
    }
    res.status(200).json({ kpis });
  } catch (error) {
    console.error("Error fetching KPIs:", error);
    res.status(500).json({ error: "Error fetching KPIs" });
  }
}
