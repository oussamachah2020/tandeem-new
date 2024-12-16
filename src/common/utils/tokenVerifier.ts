import { JwtPayload, jwtDecode } from "jwt-decode";

/**
 * Checks if the given access token is expired.
 * @param token - The JWT access token to check.
 * @returns {boolean} - True if the token is expired, false otherwise.
 */
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) {
    return true; // Treat null or undefined tokens as expired
  }

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    if (!decoded.exp) {
      return true; // No expiration field in the token, assume expired
    }

    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true; // If decoding fails, assume the token is expired
  }
};
