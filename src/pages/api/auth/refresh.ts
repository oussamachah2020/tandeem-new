import type { NextApiRequest, NextApiResponse } from "next";
import { JwtPayload, sign, verify } from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TOKEN_SECRET = process.env.JWT_PUBLIC_KEY!;
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

    console.log({ paylod: decoded });

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const newAccessToken = sign(
      { id: user.id, email: user.email },
      TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(403).json({ error: "Invalid refresh token" });
  }
}
