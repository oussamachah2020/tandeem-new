import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import partnerService from "@/domain/partners/services/PartnerService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Ensure this endpoint only handles DELETE requests
    if (req.method !== "DELETE") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Extract the partner ID from the request body
    const { id } = req.body;

    console.log({ id });

    if (!id) {
      return res.status(400).json({ message: "Missing partner ID" });
    }

    // Call the service to delete the partner
    await partnerService.deleteOne(id);

    // Respond with a success message
    return res.status(200).json({ message: "Partner deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting partner:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default authMiddleware(handler);
