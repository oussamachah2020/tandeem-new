import { FC, ReactNode, use, useEffect, useMemo, useState } from "react";
import { TitleBar } from "@/common/components/global/TitleBar";
import { SectionName, SECTIONS as Sections } from "@/common/security/Sections";
import * as Icons from "@heroicons/react/24/outline";
import { AuthenticatedUser } from "@/common/services/AuthService";
import Link from "@/common/components/atomic/Link";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/common/utils/tokenVerifier";
import { MenuIcon } from "lucide-react";
import { User } from "../../../../types/auth";

interface Props {
  user: User | null;
  section: SectionName;
  children?: ReactNode;
}

export const Main: FC<Props> = ({ user, section, children }) => {
  const { accessToken, refreshToken, authenticatedUser, setTokens } =
    useAuthStore();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isExpired = isTokenExpired(accessToken);
  const sections = useMemo(() => {
    if (authenticatedUser) {
      return Sections.filter(({ authorizedRoles }) => {
        return authorizedRoles.includes(authenticatedUser?.role);
      });
    }
  }, [authenticatedUser, authenticatedUser?.role]);

  const refreshAccessToken = async (refreshToken: string) => {
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
        setTokens(data?.accessToken ?? "", refreshToken);
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
  };

  useEffect(() => {
    const redirection = setInterval(() => {
      if (!accessToken && !authenticatedUser) {
        router.replace("/login");
      }
    }, 1000);

    return () => clearInterval(redirection);
  }, [accessToken, authenticatedUser]);

  useEffect(() => {
    if (isExpired) {
      refreshAccessToken(refreshToken ?? "");
    }
  }, [isExpired, refreshToken]);

  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <aside
          className={`fixed top-0 left-0 z-40 h-screen transform transition-transform duration-300 ease-in-out bg-white border-r
    ${
      isSidebarOpen ? "translate-x-0" : "-translate-x-full"
    } lg:static lg:translate-x-0 lg:w-80 w-64`}
        >
          <div className="h-full flex flex-col gap-16 px-3 py-12 overflow-y-auto">
            <img
              className="mx-auto h-10"
              src={`/img/${isSidebarOpen ? "logo-blue-1" : "logo-blue"}.svg`}
              alt="Logo Tandeem"
            />
            <ul className="space-y-3 text-gray-400">
              {section &&
                sections
                  ?.filter((section) => section.showInSidebar)
                  .map(({ name, icon, href }, idx) => {
                    const Icon = Icons[icon];
                    return (
                      <li key={idx}>
                        <Link
                          className={`grid gap-5 px-4 py-3 rounded-lg transition duration-150 ${
                            section === name
                              ? "text-secondary"
                              : "hover:text-secondary hover:bg-neutral-50"
                          }`}
                          style={{ gridTemplateColumns: "auto minmax(0, 1fr)" }}
                          styled={false}
                          internal={true}
                          href={href}
                        >
                          <Icon className="w-7 h-7" />
                          <div
                            className={`whitespace-nowrap text-ellipsis overflow-hidden`}
                          >
                            <span
                              className={
                                section === name
                                  ? "text-secondary"
                                  : "hover:text-secondary hover:bg-neutral-50 text-black"
                              }
                            >
                              {name}
                            </span>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className="w-full min-h-screen flex flex-col 
  px-4 sm:px-6 md:px-10 lg:px-24 
  py-6 md:py-10 lg:py-14 
  overflow-hidden"
        >
          <div className="w-full flex flex-row items-center justify-between mb-6 md:mb-10">
            <button
              className="lg:hidden p-2 rounded-full bg-secondary text-white 
        flex items-center justify-center 
        shadow-md hover:bg-secondary/90 
        transition-colors duration-300"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
            <TitleBar title={section} userImageSrc={undefined} />
          </div>

          <div
            className="flex-1 overflow-y-auto 
      scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-secondary/50
      pr-2"
            style={{
              maxHeight: "calc(100vh - 150px)",
              scrollbarGutter: "stable",
            }}
          >
            {children}
          </div>
        </main>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
      </div>
    </>
  );
};
