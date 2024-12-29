import { NextApiResponse } from "next";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import employeeService from "@/domain/employees/services/EmployeeService";

const resetPasswordHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  try {
    const result = await employeeService.resetPassword(id);
    return res
      .status(200)
      .json({ message: "Password reset successfully", result });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(resetPasswordHandler);
