import { NextApiRequest, NextApiResponse } from "next";
import adminService from "@/domain/admins/services/AdminService";
import { getAuthStore } from "@/zustand/auth-store";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Ensure this endpoint only handles POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // Parse the request body
    const { body } = req;

    // Get the authenticated user from the Zustand store
    const user = getAuthStore().authenticatedUser;

    if (!user || !user.customer?.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user or customer ID" });
    }

    // Add the new admin, attaching the user data and URL
    const newAdmin = await adminService.addOne({
      ...body, // Admin creation DTO data from the request body
      customerId: user.customer?.id, // Include customer ID from the Zustand store
    });

    // Respond with the created admin data
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error);
    res.status(500).json({ message: "Internal Server Error", error: error });
  }
}
