import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
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
    const result = await adminService.resetPassword(id);
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error resetting admin password:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default authMiddleware(handler);
