import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const ACCESS_TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;
const REFRESH_TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;

interface SignupBody {
  email: string;
  password: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password }: SignupBody = await req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existingAccount = await prisma.user.findUnique({
      where: { email },
      include: { customer: true },
    });

    if (existingAccount) {
      const isPasswordMatching = await bcrypt.compare(
        password,
        existingAccount.password
      );

      if (isPasswordMatching) {
        const accessToken = jwt.sign(
          {
            id: existingAccount.id,
            email: existingAccount.email,
            role: existingAccount.role,
            customer: existingAccount.customer,
          },
          ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
          {
            id: existingAccount.id,
            email: existingAccount.email,
            role: existingAccount.role,
          },
          REFRESH_TOKEN_SECRET,
          { expiresIn: "1d" }
        );
        return res.status(200).json({
          message: "Account valid",
          accessToken,
          refreshToken,
        });
      } else {
        return res.status(404).json({ message: "Invalid credentials" });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the account
    const newAccount = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: "TANDEEM",
      },
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: newAccount.id, email: newAccount.email, role: newAccount.role },
      ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { id: newAccount.id, email: newAccount.email, role: newAccount.role },
      REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );


    return res.status(201).json({
      message: "Account created successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
