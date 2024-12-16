import { FC, ReactNode, use, useEffect, useMemo, useState } from "react";
import { TitleBar } from "@/common/components/global/TitleBar";
import { SectionName, SECTIONS as Sections } from "@/common/security/Sections";
import * as Icons from "@heroicons/react/24/outline";
import { AuthenticatedUser } from "@/common/services/AuthService";
import Link from "@/common/components/atomic/Link";
import { useAuthStore } from "@/zustand/auth-store";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "@/common/utils/tokenVerifier";
import { refreshAccessToken } from "@/common/utils/tokenRefresher";
import { retrieveTokenPayload } from "@/common/utils/tokenDecoder";
import { MenuIcon } from "lucide-react";

interface Props {
  user: AuthenticatedUser;
  section: SectionName;
  children?: ReactNode;
}

export const Main: FC<Props> = ({ user, section, children }) => {
  const { accessToken, refreshToken, authenticatedUser } = useAuthStore();
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

  useEffect(() => {
    const redirection = setInterval(() => {
      if (!accessToken && !authenticatedUser) {
        router.replace("/login");
      }
    }, 1000);

    return () => clearInterval(redirection);
  }, [accessToken, authenticatedUser]);

  useEffect(() => {
    refreshAccessToken(refreshToken ?? "");
  }, [isExpired, refreshToken]);

  return (
    <>
      <div className="flex overflow-hidden">
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
        <main className="w-full flex flex-col gap-10 py-14 px-5 md:px-10 lg:px-24">
          <div className="flex flex-row items-center gap-4 justify-between">
            <button
              className="flex z-0 p-3 bg-secondary text-white rounded-full shadow-lg lg:hidden"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
            >
              <MenuIcon className="h-4 w-4" />
            </button>
            <TitleBar title={section} userImageSrc={undefined} />
          </div>
          <div className="py-5">{children}</div>
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
