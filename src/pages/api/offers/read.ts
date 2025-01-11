import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import offerService from "@/domain/offers/shared/services/OfferService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const user = req.user;

    if (user?.role === "TANDEEM") {
      const offers = await offerService.getAllForLevel1();
      return res.status(200).json({ offers });
    } else {
      const offers = await offerService.getAllForLevel2();
      return res.status(200).json({ offers });
    }
    // const customer = await customerService.getOne(user?.customer!.id);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export default authMiddleware(handler);
