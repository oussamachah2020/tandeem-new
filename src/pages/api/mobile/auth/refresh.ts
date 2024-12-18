import type { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOKEN_SECRET = process.env.JWT_PRIVATE_KEY!;
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token is required" });
  }

  try {
    const decoded = verify(refreshToken, TOKEN_SECRET) as JwtPayload;

    const employee = await prisma.employee.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        role: true,
        customerId: true,
        phone: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(403).json({ error: "User not found" });
    }

    const newAccessToken = sign(
      {
        id: employee.id,
        phoneNumber: employee.phone,
        role: employee.role,
        customerId: employee.customerId,
      },
      TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(403).json({ error: "Invalid refresh token" });
  }
}
