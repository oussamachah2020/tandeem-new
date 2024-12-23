import { NextApiRequest, NextApiResponse } from "next";
import { PartnerUpdateDto } from "@/domain/partners/dtos/PartnerUpdateDto";
import partnerService from "@/domain/partners/services/PartnerService";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

const updatePartnerHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const partner: PartnerUpdateDto = req.body;
    console.log(partner);

    // Update the partner using the service
    const updatedPartner = await partnerService.updateOne({ ...partner });

    return res.status(200).json(updatedPartner);
  } catch (error) {
    console.error("Error updating partner:", error);
    return res.status(500).json({ error: "Failed to update partner" });
  }
};

export default authMiddleware(updatePartnerHandler);
