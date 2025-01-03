import authService from "@/common/services/AuthService";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the request method is POST
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { email } = req.body;

  // Validate the email input
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Check if the user exists
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "No user with this email exists" });
    }

    // Create a reset password request
    const mail = await authService.createResetPasswordRequest(email);

    if (mail) {
      return res
        .status(200)
        .json({ message: "Reset password email sent successfully" });
    } else {
      return res
        .status(500)
        .json({ message: "Failed to send reset password email" });
    }
  } catch (error) {
    console.error("Error in reset password handler:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
