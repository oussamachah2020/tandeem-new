import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import { NextApiResponse } from "next";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const { id } = req.body; // Get media ID from request body
    const user = req?.user; // Get the authenticated user

    const result = await mediaLibraryService.deleteOne({
      id,
      customerId: user?.customer?.id,
    });

    if (result) {
      return res.status(200).json({ message: "Media deleted successfully" });
    } else {
      return res.status(404).json({ message: "Media not found" });
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    return res.status(500).json({ message: "Failed to delete media" });
  }
}

export default authMiddleware(handler);
