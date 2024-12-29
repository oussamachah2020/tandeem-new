import { NextApiResponse } from "next";
import { PartnerCreateDto } from "@/domain/partners/dtos/PartnerCreateDto";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import partnerService from "@/domain/partners/services/PartnerService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Ensure this endpoint only handles POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Extract the partner creation DTO from the request body
    const partnerDto: PartnerCreateDto = req.body;

    // Validate the input data (optional but recommended)
    if (!partnerDto) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Add the partner using the service
    const result = await partnerService.addOne({ ...partnerDto });

    // Respond with the created partner data
    return res.status(201).json(result);
  } catch (error: any) {
    console.error("Error in Partner API:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default authMiddleware(handler);
