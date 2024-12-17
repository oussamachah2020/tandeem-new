import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;
const REFRESH_TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;

interface LoginBody {
  phoneNumber: string;
  customerId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phoneNumber, customerId }: LoginBody = req.body;

  if (!phoneNumber || !customerId) {
    return res
      .status(400)
      .json({ error: "Phone number and customer ID are required" });
  }

  try {
    // Check if the employee exists
    const existingEmployee = await prisma.employee.findFirst({
      where: {
        phone: phoneNumber,
        customerId: customerId,
      },
    });

    if (existingEmployee) {
      const accessToken = jwt.sign(
        {
          id: existingEmployee.id,
          phoneNumber: existingEmployee.phone,
          role: existingEmployee.role,
        },
        ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        {
          id: existingEmployee.id,
          phoneNumber: existingEmployee.phone,
          role: existingEmployee.role,
        },
        REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        message: existingEmployee
          ? "Login successful"
          : "Employee account created successfully",
        accessToken,
        refreshToken,
      });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
