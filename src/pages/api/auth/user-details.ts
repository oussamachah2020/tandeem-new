import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { retrieveTokenPayload } from "@/common/utils/tokenDecoder";

const prisma = new PrismaClient();

// Helper function to verify token
// const verifyToken = (token: string) => {
//   try {
//     return jwt.verify(token, process.env.JWT_PUBLIC_SECRET!);
//   } catch (err) {
//     return null;
//   }
// };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Check for authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  //   const decodedToken = verifyToken(token);

  //   if (!decodedToken) {
  //     return res.status(403).json({ error: "Forbidden" });
  //   }

  const payload = retrieveTokenPayload(token);

  try {
    if (payload) {
      // Fetch user from database
      const user = await prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
