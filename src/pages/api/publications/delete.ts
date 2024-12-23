import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware"; // Assuming authMiddleware exists
import publicationService from "@/domain/publications/services/PublicationService";

// Custom API handler for deleting a publication
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { id } = req.body; // Retrieve the id from the request body

    if (!id) {
      return res.status(400).json({ error: "Publication ID is required." });
    }

    // Call the service to delete the publication
    await publicationService.deleteOne(id);

    return res.status(200).json({
      message: "Publication deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting publication:", error);
    return res.status(500).json({ error: "Failed to delete publication." });
  }
};

export default authMiddleware(handler); // Using authMiddleware to secure the route
