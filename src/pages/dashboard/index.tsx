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
  const { authenticatedUser } = useAuthStore(); // Access Zustand auth store
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

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await fetch("/api/dashboard/kpis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: authenticatedUser?.role,
            customerId: authenticatedUser?.customer?.id,
          }),
        });

        const data = await response.json();
        setKpis(data.kpis);
      } catch (error) {
        console.error("Error fetching KPIs:", error);
      }
    };

    if (authenticatedUser) fetchKPIs();
  }, [authenticatedUser]);

  return (
    <Main section={SectionName.Dashboard} user={authenticatedUser}>
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
                <h3 className="text-lg text-gray-700 mb-0">Offres acceptées</h3>
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
    </Main>
  );
};

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ): Promise<
//   GetServerSidePropsResult<{ user: AuthenticatedUser; kpis: any }>
// > => {
//   // Get user from auth store
//   const currentUser = retrieveTokenPayload(context.re)

//   // Validate user
//   if (!currentUser || !currentUser.id) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   // Fetch user with their specific details
//   const user = await prisma.user.findUnique({
//     where: { id: currentUser.id },
//     include: {
//       customer: true,
//       admin: true,
//     },
//   });

//   if (!user) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   // Initialize KPIs with default values
//   const kpis = {
//     admins: 0,
//     customers: 0,
//     partners: 0,
//     offers: 0,
//     publications: 0,
//     medias: 0,
//     employees: 0,
//     acceptedOffers: 0,
//     awaitingOffers: 0,
//     ideaBox: 0,
//   };

//   // Role-based KPI fetching
//   try {
//     // TANDEEM level access (highest level)
//     if (user.role === Role.TANDEEM) {
//       kpis.admins = await prisma.admin.count({
//         where: { user: { customer: { is: null } } },
//       });
//       kpis.customers = await prisma.customer.count();
//       kpis.partners = await prisma.partner.count();
//       kpis.offers = await prisma.offer.count({
//         where: { customer: { is: null } },
//       });
//       kpis.publications = await prisma.publication.count({
//         where: { customer: { is: null } },
//       });
//       kpis.medias = await prisma.mediaLibrary.count({
//         where: { customer: { is: null } },
//       });
//     }

//     // Customer or Admin level access
//     if (user.role === Role.CUSTOMER || user.role === Role.TANDEEM) {
//       const customerId = user.customer?.id;

//       if (customerId) {
//         kpis.admins = await prisma.admin.count({
//           where: { user: { customerId } },
//         });
//         kpis.employees = await prisma.employee.count({
//           where: { customerId },
//         });
//         kpis.offers = await prisma.offer.count({
//           where: { customerId },
//         });
//         kpis.acceptedOffers = await prisma.offer.count({
//           where: {
//             customerId,
//             acceptedBy: { some: { customerId } },
//           },
//         });
//         kpis.awaitingOffers = await prisma.offer.count({
//           where: {
//             customer: { is: null },
//             acceptedBy: { every: { customerId: { not: customerId } } },
//           },
//         });
//         kpis.publications = await prisma.publication.count({
//           where: { customerId },
//         });
//         kpis.medias = await prisma.mediaLibrary.count({
//           where: { customerId },
//         });
//         kpis.ideaBox = await prisma.ideaBox.count({
//           where: { employee: { customerId } },
//         });
//       }
//     }

//     // Employee level access (limited view)
//     if (user.role === Role.EMPLOYEE) {
//       const customerId = user.customer?.id;

//       if (customerId) {
//         kpis.offers = await prisma.offer.count({
//           where: { customerId },
//         });
//         kpis.publications = await prisma.publication.count({
//           where: { customerId },
//         });
//         kpis.ideaBox = await prisma.ideaBox.count({
//           where: { employee: { customerId } },
//         });
//       }
//     }
//   } catch (error) {
//     console.error("Error fetching KPIs:", error);
//   }

//   return {
//     props: {
//       user: {
//         id: user.id,
//         email: user.email!,
//         role: user.role,
//         customer: user.customer,
//         name: user.admin?.name ?? "",
//       },
//       kpis,
//     },
//   };
// };
export default Dashboard;
