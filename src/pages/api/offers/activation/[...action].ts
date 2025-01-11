import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import offerService from "@/domain/offers/shared/services/OfferService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const action = req.query["action"] as string;

  const { id } = req.body;

  const message = await offerService.switchActivation({
    offerId: id,
    active: action[0] === "activate",
  });

  if (message === "offerEnabledSuccess") {
    return res.status(200).json({ message: "Offer activated" });
  } else {
    return res.status(200).json({ message: "Offer desactivated" });
  }
}

export default authMiddleware(handler);
