import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { MediaDto } from "@/domain/media-library/dto/MediaDto";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const body: MediaDto = req.body;
    const user = req?.user;

    // Call service method to add media
    const result = await mediaLibraryService.addOne({
      ...body,
      customerId: user?.customer?.id || "",
    });

    // Send success response
    return res.status(200).json({ message: result });
  } catch (error) {
    // Handle errors and send error response
    console.error(error);
    return res.status(500).json({ error: "Failed to add media" });
  }
}

export default authMiddleware(handler);
