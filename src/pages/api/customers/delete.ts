import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import customerService from "@/domain/customers/services/CustomerService";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { id } = req.body;


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
