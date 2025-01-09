import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import ideaBoxService from "@/domain/ideabox/services/IdeaBoxService";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { id } = req.query;

    const customerId = id as string;
    const ideas = await ideaBoxService.getAll(customerId);

    return res.status(200).json(ideas);
  } catch (error) {
    return res.status(500).json(error);
  }
}

export default authMiddleware(handler);
