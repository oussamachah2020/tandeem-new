import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Ensure this endpoint only handles POST or PATCH requests (adjust if needed)
  if (req.method !== "POST" && req.method !== "PATCH") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Ensure the request is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.body as { id: string };

  // Validate the required `id` field
  if (!id) {
    return res.status(400).json({ message: "Bad Request: 'id' is required" });
  }

  try {
    const updatedAdmin = await adminService.toggleActive(id, false);
    return res.status(200).json(updatedAdmin);
  } catch (error: any) {
    console.error("Error toggling admin active status:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default authMiddleware(handler);
