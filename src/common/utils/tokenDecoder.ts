import { Payload } from "../../../types/auth";

export function retrieveTokenPayload(token: string) {
  try {
    if (token) {
      // Split the token into its parts: header, payload, and signature
      const parts = token.split(".");

      if (parts.length !== 3) {
        throw new Error("Invalid token format");
      }

      // Extract the payload (second part) and decode it
      const payloadBase64 = parts[1];
      const payloadJson = atob(
        payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
      );

      // Parse the JSON string into an object
      const payload = JSON.parse(payloadJson);

      return payload as Payload;
    }
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
}
