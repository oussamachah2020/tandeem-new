import { NextApiResponse } from "next";
import publicationService from "@/domain/publications/services/PublicationService";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Ensure this endpoint only handles POST requests
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    const publications = await publicationService.getAll();

    // Respond with the created partner data
    return res.status(200).json(publications);
  } catch (error: any) {
    console.error("Error in Partner API:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

export default authMiddleware(handler);
