import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import offerService from "@/domain/offers/shared/services/OfferService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  const action = req.query["action"] as string;
  const { offerId } = req.body;
  return await offerService.switchActivation({
    offerId,
    active: action === "activate",
  });
}

export default authMiddleware(handler);
