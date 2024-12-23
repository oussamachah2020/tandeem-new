import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import { NextPage } from "next";
import { AuthenticatedUser } from "@/common/services/AuthService";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import useModal from "@/common/hooks/UseModal";
import AdminTable from "@/domain/admins/components/AdminTable";
import adminService from "@/domain/admins/services/AdminService";
import { Modal } from "@/common/components/global/Modal";
import AdminCreateForm from "@/domain/admins/components/AdminCreateForm";
import useFilter from "@/common/hooks/UseFilter";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import { ArrayElement } from "@/common/utils/types";
import AdminUpdateForm from "@/domain/admins/components/AdminUpdateForm";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

interface Props {}

const Admins: NextPage<Props> = () => {
  const { label, action } = useStaticValues();
  const [admins, setAdmins] = useState<any[]>([]);

  const [searchResultedAdmins, onSearchInputChange] = useSearch(admins, [
    "name",
    "user.email" as any,
  ]);
  const [filteredResults, onFilterValueChange] = useFilter(
    searchResultedAdmins,
    ["user.isActive" as any]
  );
  const [, isAddAdminModalShown, toggleAddAdminModal] = useModal(false);
  const [adminToUpdate, isUpdateAdminModalShown, toggleAdminUpdateModal] =
    useModal<ArrayElement<typeof admins>>();
  const { accessToken, authenticatedUser } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admins/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
      }
      const data = await response.json();
      setAdmins(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [authenticatedUser]);


  return (
    <Main section={SectionName.Admins} user={authenticatedUser}>
      <ActionBar
        onSearchInputChange={onSearchInputChange}
        action={{
          text: action.adminAdd,
          onClick: () => toggleAddAdminModal(true),
        }}
      />
      <FilterGroup>
        <Filter
          icon="ArrowPathIcon"
          label={label.status}
          values={[
            ["true", "Actif"],
            ["false", "Suspendu"],
          ]}
          onValueChange={(event) =>
            onFilterValueChange("user.isActive" as any, event)
          }
        />
      </FilterGroup>
      {loading ? (
        <div className="h-40 flex justify-center items-center w-full bg-white">
          <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : (
        <AdminTable
          admins={filteredResults}
          onUpdate={(admin) => toggleAdminUpdateModal(true, admin)}
        />
      )}
      <Modal
        title={action.adminAdd}
        isShown={isAddAdminModalShown}
        onClose={() => toggleAddAdminModal(false)}
      >
        <AdminCreateForm onClose={() => toggleAddAdminModal(false)} />
      </Modal>
      <Modal
        title={action.adminUpdate}
        isShown={isUpdateAdminModalShown}
        onClose={() => toggleAdminUpdateModal(false)}
      >
        <AdminUpdateForm admin={adminToUpdate} />
      </Modal>
    </Main>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const user = getAuthStore().authenticatedUser;

//   if (user) {
//     const admins = await adminService.getAll(user.customer?.id);

//     const result: GetServerSidePropsResult<Props> = {
//       props: {
//         user: JSON.parse(JSON.stringify(user)),
//         admins: JSON.parse(JSON.stringify(admins)),
//       },
//     };

//     return result;
//   } else {
//     return [];
//   }
// };

export default Admins;
