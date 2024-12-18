import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { retrieveTokenPayload } from "@/common/utils/tokenDecoder"; // Adjust the import path based on your project structure
import { Payload } from "../types/auth";

// Define a custom request type that includes the user
// This helps with TypeScript so you can use req.user in handlers
export interface AuthenticatedRequest extends NextApiRequest {
  user?: Payload;
}

/**
 * Authentication middleware for Next.js API routes.
 *
 * Usage:
 *
 * export default authMiddleware((req: AuthenticatedRequest, res: NextApiResponse) => {
 *   // At this point, req.user is guaranteed to be defined
 *   res.status(200).json({ message: "Protected route accessed!", user: req.user });
 * });
 */
export function authMiddleware(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Extract the token from headers
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res
          .status(401)
          .json({ error: "Missing or invalid Authorization header" });
      }

      const token = authHeader.split(" ")[1];

      // Retrieve the token payload using your existing verification function
      const user = retrieveTokenPayload(token);

      if (!user) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      // Attach the user payload to the request object
      req.user = user;

      // Call the original handler now that req.user is set
      return handler(req, res);
    } catch (error) {
      console.error("Middleware Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}
