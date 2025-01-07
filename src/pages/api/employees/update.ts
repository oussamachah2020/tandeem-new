import { NextApiResponse } from "next";
import employeeService from "@/domain/employees/services/EmployeeService";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

// Main API handler
async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { employeeDto } = req.body;

    if (!employeeDto) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Update employee with the provided data
    const updatedEmployee = await employeeService.updateOne(employeeDto);

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export default authMiddleware(handler);
