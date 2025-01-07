import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { md5Hash } from "@/common/utils/functions";

const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;
const REFRESH_TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;

interface LoginBody {
  phoneNumber?: string;
  email?: string;
  password?: string;
}

const generateTokens = (payload: object) => {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "1h",
  });
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });
  return { accessToken, refreshToken };
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { phoneNumber, email, password }: LoginBody = req.body;

  try {
    let existingEmployee;

    if (phoneNumber) {
      existingEmployee = await prisma.employee.findFirst({
        where: { phone: phoneNumber },
      });
    } else if (email && password) {
      existingEmployee = await prisma.employee.findFirst({
        where: { user: { email } },
        include: { user: true },
      });

      if (existingEmployee) {
        // Compare the bcrypt-hashed password
        const isPasswordMatching = await bcrypt.compare(
          email,
          existingEmployee.user.password
        );

        if (!isPasswordMatching) {
          return res.status(401).json({ error: "Invalid credentials" });
        }
      }
    }

    if (!existingEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    const { accessToken, refreshToken } = generateTokens({
      id: existingEmployee.userId,
      phoneNumber: existingEmployee.phone,
      role: existingEmployee.role,
      customerId: existingEmployee.customerId,
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
