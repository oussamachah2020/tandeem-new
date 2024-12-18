import { NextApiRequest, NextApiResponse } from "next";
import customerService from "@/domain/customers/services/CustomerService";
import { CustomerCreateDto } from "@/domain/customers/dtos/CustomerCreateDto";
import { retrieveTokenPayload } from "@/common/utils/tokenDecoder";

// const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Ensure this is set in your environment variables

// // Helper function to extract and verify the token
// const retrieveTokenPayload = (token: string) => {
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     return decoded as { id: string };
//   } catch (error) {
//     console.error("Invalid token", error);
//     return null; // If token is invalid or expired, return null
//   }
// };

// Create the API handler function
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if the method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Extract the token from the Authorization header
  const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"

  try {
    if (token) {
      // Decode and verify the token
      const customerDto: CustomerCreateDto = req.body;
      const user = retrieveTokenPayload(token);

      if (user) {
        const newCustomer = await customerService.addOne({
          ...customerDto,
          userId: user.id,
        });

        // Return success response
        return res.status(201).json({
          message: "Customer created successfully",
          customer: newCustomer,
        });
      }
    }
  } catch (error: any) {
    console.error("Error creating customer:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
