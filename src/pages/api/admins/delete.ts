import { NextApiRequest, NextApiResponse } from "next";
import adminService from "@/domain/admins/services/AdminService";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Ensure this endpoint only handles DELETE requests
    if (req.method !== "DELETE") {
      return res.status(405).json({ message: "Method Not Allowed" });
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
    const result = await adminService.deleteOne({
      id,
      refs: normalizedRefs,
    });

    // Respond with the result
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}
