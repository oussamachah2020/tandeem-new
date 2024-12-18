import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import customerService from "@/domain/customers/services/CustomerService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Ensure the request method is POST or DELETE if needed
  // (Assuming a delete operation might be DELETE, adjust as required)
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Ensure the user is authenticated (authMiddleware guarantees req.user if token is valid)
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract the customer ID from the request body
  const { id } = req.body as { id: string };

  try {
    const deletedCustomer = await customerService.deleteOne(id);
    return res.status(200).json({
      message: "Customer deleted successfully",
      customer: deletedCustomer,
    });
  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(handler);
