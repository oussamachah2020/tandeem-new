import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import customerService from "@/domain/customers/services/CustomerService";
import { CustomerUpdateDto } from "@/domain/customers/dtos/CustomerUpdateDto";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Ensure the request method is POST or DELETE if needed
  // (Assuming a delete operation might be DELETE, adjust as required)
  if (req.method !== "PUT") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Extract the customer ID from the request body
  const data: CustomerUpdateDto = req.body;

  try {
    const updatedCustomer = await customerService.updateOne(data);
    return res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (error: any) {
    console.error("Error updating customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(handler);
