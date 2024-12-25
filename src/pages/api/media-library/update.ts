import { NextApiRequest, NextApiResponse } from "next";
import mediaLibraryService from "@/domain/media-library/services/MediaLibraryService";
import { MediaDto } from "@/domain/media-library/dto/MediaDto";
import { AuthenticatedRequest } from "@/apiMiddleware";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { id, title, description, url } = req.body; // Extract media details from request body
    const user = req?.user; // Get the authenticated user

    // Ensure that all required data is present
    if (!id || !title || !description || !url) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Call the service to update the media
    const updatedMedia = await mediaLibraryService.updateOne({
      id,
      title,
      description,
      url,
      customerId: user?.customer?.id,
    });

    if (updatedMedia) {
      return res
        .status(200)
        .json({ message: "Media updated successfully", media: updatedMedia });
    } else {
      return res.status(404).json({ message: "Media not found" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: "Failed to update media" });
  }
}

export default handler;
