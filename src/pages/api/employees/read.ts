import employeeService from "@/domain/employees/services/EmployeeService";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { NextApiResponse } from "next";

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not Authorized" });
  }

  console.log(user);

  try {
    const employees = await employeeService.getAll(user?.customer.id);
    const departments = await employeeService.getDepartments(user?.customer.id);

    return res.status(200).json({ employees, departments });
  } catch (error) {
    return res.status(500).json(error);
  }
}

export default authMiddleware(handler);
