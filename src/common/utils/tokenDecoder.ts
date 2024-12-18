import { verify } from "jsonwebtoken";
import { Payload } from "../../../types/auth";

export function retrieveTokenPayload(token: string): Payload | null {
  try {
    const payload = verify(token, process.env.JWT_PRIVATE_KEY!) as Payload;
    if (!payload) {
      console.error("Verified payload is null or undefined");
      return null;
    }
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}
