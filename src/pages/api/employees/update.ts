import { NextApiRequest, NextApiResponse } from "next";
import employeeService from "@/domain/employees/services/EmployeeService";

// Main API handler
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  try {
    const { employeeDto, photoUrl, customerId } = req.body;

    if (!employeeDto || !photoUrl) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Update employee with the provided data
    const updatedEmployee = await employeeService.updateOne({
      ...employeeDto,
      customerId,
      photo: photoUrl, // Use the photo URL
    });

    return res.status(200).json(updatedEmployee);
  } catch (error) {
    console.error("Error updating employee:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
