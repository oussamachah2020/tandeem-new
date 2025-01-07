import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  try {
    const user = req?.user;

    console.log(user?.customer?.id);

    // Call service to get all media for the customer
    const media = await mediaLibraryService.getAll(user?.customer?.id);

    // Send the media data as a JSON response
    return res.status(200).json(media);
  } catch (error) {
    // Handle error and send error response
    console.error(error);
    return res.status(500).json({ error: "Failed to retrieve media" });
  }
}

export default authMiddleware(handler);
