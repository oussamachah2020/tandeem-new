import { NextApiResponse } from "next";
import { authMiddleware } from "@/apiMiddleware";
import publicationService from "@/domain/publications/services/PublicationService";
import { AuthenticatedRequest } from "@/apiMiddleware";

// Custom handler with authentication and update logic
const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { body: publicationUpdateDto } = req;

  try {
    const user = req.user; // Authenticated user info
    const customerId = user?.customer?.id;

    // Update publication using the provided data and the customer ID
    await publicationService.updateOne({
      ...publicationUpdateDto,
      customerId,
    });

    res.status(200).json({
      message: "Publication updated successfully.",
    });
  } catch (error) {
    console.error("Error updating publication:", error);
    res.status(500).json({ error: "Failed to update publication." });
  }
};

// Wrap the handler with the authentication middleware
export default authMiddleware(handler);

export const config = {
  api: {
    bodyParser: true, // Allow JSON body parsing (no need for multipart)
  },
};
