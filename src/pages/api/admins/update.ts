import { NextApiRequest, NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id, name, email, photoUrl } = req.body;

  if (!id || !name || !email || !photoUrl) {
    return res
      .status(400)
      .json({ message: "Bad Request: All fields are required" });
  }

  try {
    const result = await adminService.updateOne({
      adminId: id,
      name,
      photoUrl,
    });
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error updating admin:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default authMiddleware(handler);
