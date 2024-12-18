import employeeService from "@/domain/employees/services/EmployeeService";
import { NextApiResponse } from "next";
import { EmployeeCreateDto } from "@/domain/employees/dtos/EmployeeCreateDto";
import { PrismaClient, Role } from "@prisma/client";
import { AuthenticatedRequest, authMiddleware } from "@/apiMiddleware";
import { hash } from "bcrypt";
import { md5Hash } from "@/common/utils/functions";

const prisma = new PrismaClient();

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  // Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const employeeDto: EmployeeCreateDto = req.body;

    const rawPassword = md5Hash(employeeDto.email);

    await prisma.employee.create({
      data: {
        firstName: employeeDto.firstName,
        lastName: employeeDto.lastName,
        phone: employeeDto.phone,
        registration: employeeDto.registration,
        level: employeeDto.level,
        photo: employeeDto.photoUrl,
        fcmToken: employeeDto.fcmToken,
        customer: {
          connect: { id: employeeDto.customerId },
        },
        department: employeeDto.departmentId
          ? { connect: { id: employeeDto.departmentId } }
          : {
              create: {
                title: employeeDto.departmentName!,
                customer: {
                  connect: { id: employeeDto.customerId },
                },
              },
            },
        user: {
          create: {
            email: employeeDto.email,
            password: await hash(rawPassword, 12),
            role: Role.EMPLOYEE,
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Employee created successfully",
    });
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
