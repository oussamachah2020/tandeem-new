import { useAuthStore } from "@/zustand/auth-store";

export const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    console.error("Refresh token is missing. Cannot refresh access token.");
    return;
  }

  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "Application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      //   setAccessToken(response.data.accessToken);
      //   console.log("Access token successfully refreshed.");
    } else {
      console.error(
        "Failed to refresh access token: Missing accessToken in response."
      );
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
};
