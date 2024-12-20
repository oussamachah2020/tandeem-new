import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware"; // Adjust path as necessary
import customerService from "@/domain/customers/services/CustomerService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Ensure the user is authenticated (guaranteed by authMiddleware)
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const customers = await customerService.getAll(); // Adjust the table name as needed
    return res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Wrap the handler with the authMiddleware
export default authMiddleware(handler);
