import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  console.log("Request Body:", req.body);

  const {
    email,
    password,
    firstName,
    lastName,
    photo,
    phone,
    level,
    acceptedTOS,
    fcmToken,
    customerId,
    departmentId,
  } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = await prisma.employee.create({
      data: {
        firstName,
        lastName,
        photo,
        phone,
        level,
        acceptedTOS,
        fcmToken,
        customer: {
          connect: {
            id: customerId,
          },
        },
        department: {
          connect: {
            id: departmentId,
          },
        },
        user: {
          create: {
            email,
            password: hashedPassword,
            role: Role.EMPLOYEE,
            customerId: customerId,
          },
        },
      },
      include: {
        user: true,
      },
    });

    return res.status(201).json({
      message: "Employee added successfully.",
      employee: newEmployee,
    });
  } catch (error) {
    console.error("Error adding employee:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while adding the employee." });
  }
}