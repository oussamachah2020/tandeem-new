import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import adminService from "@/domain/admins/services/AdminService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  try {
    // Ensure this endpoint only handles POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method Not Allowed" });
    }

    // At this point, req.user is guaranteed by the authMiddleware if token is valid
    const user = req.user;

    const existingUser = await prisma.user.findUnique({
      where: {
        id: user?.id,
      },
      include: {
        customer: true,
      },
    });

    // Ensure user and user.customer.id are available
    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: Missing user or customer ID" });
    }

    const body = req.body; // The Admin creation DTO data from the request body

    console.log(body, existingUser);

    // Add the new admin, attaching the user’s customerId
    await adminService.addOne({
      ...body,
    });

    // Respond with the created admin data
    return res.status(201).json({ message: "Admin created" });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error });
  }
};

export default authMiddleware(handler);
