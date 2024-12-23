import { NextApiResponse } from "next";
import publicationService from "@/domain/publications/services/PublicationService";
import { PublicationCreateDto } from "@/domain/publications/dtos/PublicationCreateDto";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

export const handler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const publication: PublicationCreateDto = req.body;

  try {
    const user = req.user; // Authenticated user info

    await publicationService.addOne({
      ...publication,
    });

    res.status(201).json({
      message: "Publication created successfully.",
    });
  } catch (error) {
    console.error("Error creating publication:", error);
    res.status(500).json({ error: "Failed to create publication." });
  }
};

export default authMiddleware(handler);
