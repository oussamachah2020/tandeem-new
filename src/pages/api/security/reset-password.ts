import { AuthenticatedRequest } from "@/apiMiddleware";
import { NextApiResponse } from "next";
import authService from "@/common/services/AuthService";

export default async function handler(
  req: AuthenticatedRequest,
  res: NextApiResponse
) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method not allowed" });
  }
  const { token, password } = req.body;

  try {
    const resetMessage = await authService.resetPassword(token, password);

    if (resetMessage === "passwordUpdatedSuccessfully") {
      return res.status(200).json({ message: "Password updated successfully" });
    } else if (resetMessage === "resetTokenExpired") {
      return res.status(400).json({ message: "Expired token" });
    } else {
      return res.status(400).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
