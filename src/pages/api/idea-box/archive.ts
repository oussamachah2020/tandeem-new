import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import ideaBoxService from "@/domain/ideabox/services/IdeaBoxService";

/**
 * API endpoint to archive an idea.
 * Protected by authMiddleware to ensure only authenticated users can access.
 */
const archiveIdeaHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id, customerId } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Idea ID is required" });
  }

  try {
    const result = await ideaBoxService.archiveOne({ id, customerId });
    return res
      .status(200)
      .json({ message: "Idea archived successfully", result });
  } catch (error) {
    console.error("Error archiving idea:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(archiveIdeaHandler);
