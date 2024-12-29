import { NextApiResponse } from "next";
import offerService from "@/domain/offers/shared/services/OfferService";
import { OfferAcceptDto } from "@/domain/offers/shared/dtos/OfferAcceptDto";
import { authMiddleware, AuthenticatedRequest } from "@/apiMiddleware";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const acceptOfferDto: OfferAcceptDto = req.body;

    // Validate required fields in the payload
    if (!acceptOfferDto || !acceptOfferDto.offerId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await offerService.acceptOffer({
      ...acceptOfferDto,
      customerId: user?.customer?.id,
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Endpoint Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Wrapping the handler with the authentication middleware
export default authMiddleware(handler);
