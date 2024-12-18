import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Ensure this endpoint only handles DELETE requests
    if (req.method !== "DELETE") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Ensure the request is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Parse the request body
    const { id, refs } = req.body;

    // Validate the required `id` field
    if (!id) {
      return res.status(400).json({ message: "Bad Request: 'id' is required" });
    }

    // Normalize `refs` into an array if provided
    const normalizedRefs = refs
      ? Array.isArray(refs)
        ? refs
        : [refs]
      : undefined;

    // Call the service to delete the admin
    const result = await adminService.deleteOne({ id, refs: normalizedRefs });

    // Respond with the result
    return res.status(200).json(result);
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export default authMiddleware(handler);
