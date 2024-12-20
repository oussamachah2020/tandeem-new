import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Ensure this endpoint only handles POST requests
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Add the new admin, attaching the user’s customerId
    const admins = await adminService.getAll();

    // Respond with the created admin data
    return res.status(200).json(admins);
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};

export default authMiddleware(handler);
