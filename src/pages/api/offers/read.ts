import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import offerService from "@/domain/offers/shared/services/OfferService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method is not allowed" });
  }

  try {
    const user = req.user;

    console.log(user);

    const customer = await customerService.getOne(user?.customer!.id);
    const offers = await offerService.getAllForLevel2();

    return res.status(200).json({ customer, offers });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export default authMiddleware(handler);
