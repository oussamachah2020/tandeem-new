import { NextApiResponse } from "next";
import { EmployeeCreateDto } from "@/domain/employees/dtos/EmployeeCreateDto";
import { PrismaClient, Role } from "@prisma/client";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";

import employeeService from "@/domain/employees/services/EmployeeService";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const employeeDto: EmployeeCreateDto = req.body;

    const message = await employeeService.addOne(employeeDto);

    if (message === "unexpectedError") {
      return res
        .status(404)
        .json({ message: "No customer with this id exist" });
    } else if (message === "maxEmployeesExceeded") {
      return res.status(400).json({ message: "Max employees Exceeded" });
    } else {
      return res.status(201).json({
        message: "Employee created successfully",
      });
    }

  } catch (error: any) {
    if (error instanceof Error) {
      return res.status(500).json({
        error: "Internal Server Error",
        details: error.message,
      });
    }

    return res.status(500).json({ error: "Unexpected error occurred" });
  }
}

export default authMiddleware(handler);
