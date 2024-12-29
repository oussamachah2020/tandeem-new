import { NextApiResponse } from "next";
import offerService from "@/domain/offers/shared/services/OfferService";
import { authMiddleware, AuthenticatedRequest } from "@/apiMiddleware";
import { getRoleLevel } from "@/common/utils/functions";
import { NAPaymentDetails } from "@/domain/offers/shared/dtos/OfferCreateDto";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    if (req.method !== "PUT") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { body: offerUpdateDto } = req;
    // const { image, coupon } = files || {};

    const roleLevel = getRoleLevel(user.role);

    if (roleLevel === 1) {
      const result = await offerService.updateLevel1Offer({
        ...offerUpdateDto,
        // image,
        // coupon
      });
      return res
        .status(200)
        .json({ message: "Offer updated successfully", result });
    } else if (roleLevel === 2) {
      const result = await offerService.updateLevel2Offer({
        ...offerUpdateDto,
        // image,
        contractorId: user.customer?.id,
        paymentDetails: JSON.stringify({
          description: offerUpdateDto.paymentDetails,
        } as NAPaymentDetails),
      });
      return res
        .status(200)
        .json({ message: "Offer updated successfully", result });
    } else {
      return res.status(403).json({ error: "Unauthorized role level" });
    }
  } catch (error) {
    console.error("Endpoint Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(handler);
