// import {Main} from "@/common/components/global/Main";
import { SectionName } from "@/common/security/Sections";
import { AuthenticatedUser } from "@/common/services/AuthService";
import {
  BriefcaseIcon,
  BuildingOfficeIcon,
  NewspaperIcon,
  ReceiptPercentIcon,
  RectangleStackIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import React, { useEffect, useState } from "react";
import { Main } from "@/common/components/global/Main";
import { getRoleLevel } from "@/common/utils/functions";
import { useAuthStore } from "@/zustand/auth-store";
import { RefreshCcw } from "lucide-react";

interface Props {
  user: AuthenticatedUser;
}

interface KPI {
  admins: number;
  customers: number;
  partners: number;
  offers: number;
  publications: number;
  medias: number;
  employees: number;
  acceptedOffers: number;
  awaitingOffers: number;
  ideaBox: number;
}

const Dashboard = ({}: Props) => {
  const { authenticatedUser, accessToken } = useAuthStore(); // Access Zustand auth store
  const [kpis, setKpis] = useState<KPI>({
    admins: 0,
    customers: 0,
    partners: 0,
    offers: 0,
    publications: 0,
    medias: 0,
    employees: 0,
    acceptedOffers: 0,
    awaitingOffers: 0,
    ideaBox: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      const customerId = authenticatedUser?.customerId;

      try {
        const response = await fetch(
          `/api/dashboard/kpis?clientId=${customerId}`, // Pass customerId in the query
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        setKpis(data.kpis);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authenticatedUser) fetchKPIs();
  }, [authenticatedUser]);

  return (
    <Main section={SectionName.Dashboard} user={authenticatedUser}>
      {loading ? (
        <div className="h-40 flex justify-center items-center w-full bg-white">
          <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-4">
            {kpis?.admins > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.Admins}
                  </h3>
                  <UsersIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.admins}</p>
              </div>
            )}
            {kpis?.customers > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.Customers}
                  </h3>
                  <BuildingOfficeIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.customers}</p>
              </div>
            )}
            {kpis?.partners > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.Partners}
                  </h3>
                  <BriefcaseIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.partners}</p>
              </div>
            )}
            {kpis?.employees > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.Employees}
                  </h3>
                  <BriefcaseIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.employees}</p>
              </div>
            )}
            {kpis?.offers > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {authenticatedUser &&
                    getRoleLevel(authenticatedUser?.role) === 1
                      ? SectionName.Offers
                      : "Mes offres exclusives"}
                  </h3>
                  <ReceiptPercentIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.offers}</p>
              </div>
            )}
            {kpis?.acceptedOffers > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    Offres acceptées
                  </h3>
                  <ReceiptPercentIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.acceptedOffers}</p>
              </div>
            )}
            {kpis?.awaitingOffers > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    Offres en attente
                  </h3>
                  <ReceiptPercentIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.awaitingOffers}</p>
              </div>
            )}
            {kpis?.publications > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.Publications}
                  </h3>
                  <NewspaperIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.publications}</p>
              </div>
            )}
            {kpis?.medias > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.MediaLibrary}
                  </h3>
                  <RectangleStackIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.medias}</p>
              </div>
            )}
            {kpis?.ideaBox > -1 && (
              <div className="flex flex-col justify-center gap-3 px-6 py-4 rounded-lg bg-white border border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg text-gray-700 mb-0">
                    {SectionName.IdeaBox}
                  </h3>
                  <RectangleStackIcon className="w-7 h-7" />
                </div>
                <p className="text-3xl font-medium">{kpis.ideaBox}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </Main>
  );
};

export default Dashboard;
