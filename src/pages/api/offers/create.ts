import { NextApiRequest, NextApiResponse } from "next";
import {
  NAPaymentDetails,
  OfferCreateDto,
} from "@/domain/offers/shared/dtos/OfferCreateDto";
import offerService from "@/domain/offers/shared/services/OfferService";
import { getRoleLevel } from "@/common/utils/functions";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const payload: OfferCreateDto = req.body;
    const roleLevel = getRoleLevel(user.role);

    // Validate required fields in the payload
    if (!payload || !payload.title || !payload.description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Handle based on user role
    if (roleLevel === 1) {
      const result = await offerService.addLevel1Offer({
        ...payload,
        image: payload.imageUrl,
        coupon: payload.couponUrl,
      });
      return res.status(200).json(result);
    } else if (roleLevel === 2) {
      const result = await offerService.addLevel2Offer({
        ...payload,
        image: payload.imageUrl,
        contractorId: req.user?.customer.id ?? "",
        paymentDetails: JSON.stringify({
          description: payload.paymentDetails,
        } as NAPaymentDetails),
      });
      return res.status(200).json(result);
    } else {
      return res.status(403).json({ error: "Unauthorized role level" });
    }
  } catch (error) {
    console.error("Endpoint Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Wrapping the handler with the authentication middleware
export default authMiddleware(handler);
