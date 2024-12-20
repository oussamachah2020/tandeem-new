import { NextApiResponse } from "next";
import employeeService from "@/domain/employees/services/EmployeeService";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

const deleteEmployeeHandler = async (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Employee ID is required" });
  }

  try {
    const result = await employeeService.deleteOne(id);
    return res
      .status(200)
      .json({ message: "Employee deleted successfully", result });
  } catch (error) {
    console.error("Error deleting employee:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default authMiddleware(deleteEmployeeHandler);
