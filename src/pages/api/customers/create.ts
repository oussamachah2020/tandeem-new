import { NextApiResponse } from "next";
import prisma from "@/common/libs/prisma";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware"; // Update with correct path
import customerService from "@/domain/customers/services/CustomerService";
import { CustomerCreateDto } from "@/domain/customers/dtos/CustomerCreateDto";

const handler = async (req: AuthenticatedRequest, res: NextApiResponse) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // At this point, req.user is guaranteed by the middleware if token is valid
  const user = req.user;
  if (!user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const customerDto: CustomerCreateDto = req.body;
    const newCustomer = await customerService.addOne({
      ...customerDto,
      userId: user.id,
    });

    return res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
    });
  } catch (error: any) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(handler);
