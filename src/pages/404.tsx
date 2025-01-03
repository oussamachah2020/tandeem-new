import React, { useEffect } from "react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const { accessToken } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    const redirection = setInterval(() => {
      if (accessToken) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 200);

    return () => clearInterval(redirection);
  }, [accessToken]);

  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen bg-white">
      <div className="text-6xl font-bold text-primary underline decoration-secondary decoration-4">
        404
      </div>
      <div className="text-center">
        <p>Oops ! Page non trouvée</p>
        <p>Il semblerait que vous vous soyez aventuré en territoire inconnu.</p>
      </div>
      <div>
        <a
          href="/dashboard"
          className="flex items-center gap-2.5 border rounded-lg px-3 py-2 hover:bg-gray-50 transition duration-200"
        >
          <HomeIcon className="w-5 h-5" /> Accueil
        </a>
      </div>
    </div>
  );
};

export default NotFound;
