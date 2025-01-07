import { Main } from "@/common/components/global/Main";
import { ChangeEvent, useEffect, useState } from "react";
import { SectionName } from "@/common/security/Sections";
import { NextPage } from "next";
import { Modal } from "@/common/components/global/Modal";
import useSearch from "@/common/hooks/UseSearch";
import ActionBar from "@/common/components/global/ActionBar";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import useFilter from "@/common/hooks/UseFilter";
import { AuthenticatedUser } from "@/common/services/AuthService";
import { EmployeeCreateForm } from "@/domain/employees/components/EmployeeCreateForm";
import EmployeeTable from "@/domain/employees/components/EmployeeTable";
import useModal from "@/common/hooks/UseModal";
import employeeService from "@/domain/employees/services/EmployeeService";
import { labeledJobLevels } from "@/common/utils/statics";
import { EmployeeUpdateForm } from "@/domain/employees/components/EmployeeUpdateForm";
import EmployeeDetails from "@/domain/employees/components/EmployeeDetails";
import { ArrayElement } from "@/common/utils/types";
import { useAuthStore } from "@/zustand/auth-store";
import { RefreshCcw } from "lucide-react";

type initialEmployees = Awaited<ReturnType<typeof employeeService.getAll>>;
type Department = Awaited<ReturnType<typeof employeeService.getDepartments>>;

const EmployeesPage = () => {
  const [, isAddEmployeeModalShown, setIsAddEmployeeModalShown] =
    useModal(false);
  const [
    employeeToUpdate,
    isEditEmployeeModalShown,
    setIsEditEmployeeModalShown,
  ] = useModal<ArrayElement<initialEmployees>>();
  const [employeeToShow, isEmployeeModalShown, setIsEmployeeModalShown] =
    useModal<ArrayElement<initialEmployees>>();
  const { authenticatedUser, accessToken } = useAuthStore();

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const [searchResultedEmployees, onSearchInputChange] = useSearch(employees, [
    "firstName",
    "lastName",
    "registration",
  ]);

  const [filteredEmployees, onFilterValueChange] = useFilter(
    searchResultedEmployees,
    ["department.id" as any, "level"]
  );

  const [loading, setLoading] = useState(false);

  async function fetchEmployees() {
    if (!authenticatedUser) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/employees/read?customerId=${authenticatedUser.customerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees);
        setDepartments(data.departments);
      } else {
        console.error("Failed to fetch employees");
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEmployees();
  }, [authenticatedUser]);

  return (
    <>
      <Main section={SectionName.Employees} user={authenticatedUser}>
        <ActionBar
          action={{
            text: "Ajouter un salarié",
            onClick: () => setIsAddEmployeeModalShown(true),
          }}
          onSearchInputChange={onSearchInputChange}
        />
        <FilterGroup>
          <Filter
            label="Departement"
            icon="BuildingOfficeIcon"
            values={departments.map(({ id, title }) => [id, title])}
            onValueChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterValueChange("department.id" as any, e)
            }
          />
          <Filter
            label="Poste"
            icon="BriefcaseIcon"
            values={labeledJobLevels}
            onValueChange={(e: ChangeEvent<HTMLSelectElement>) =>
              onFilterValueChange("level", e)
            }
          />
        </FilterGroup>
        {loading ? (
          <div className="h-40 flex justify-center items-center w-full bg-white">
            <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <EmployeeTable
            employees={filteredEmployees}
            onClick={(employee: any) => setIsEmployeeModalShown(true, employee)}
            onUpdate={(employee: any) =>
              setIsEditEmployeeModalShown(true, employee)
            }
          />
        )}
      </Main>
      <Modal
        title="Ajouter un salarié"
        isShown={isAddEmployeeModalShown}
        onClose={() => setIsAddEmployeeModalShown(false)}
      >
        <EmployeeCreateForm
          customerId={authenticatedUser?.id ?? ""}
          departments={departments}
          onClose={() => setIsAddEmployeeModalShown(false)}
        />
      </Modal>
      <Modal
        title="Modifier le salarié"
        isShown={isEditEmployeeModalShown}
        onClose={() => setIsEditEmployeeModalShown(false)}
      >
        <EmployeeUpdateForm
          employee={employeeToUpdate}
          departments={departments}
          onClose={() => setIsEditEmployeeModalShown(false)}
        />
      </Modal>
      <Modal
        title="Détails du salarié"
        isShown={isEmployeeModalShown}
        onClose={() => setIsEmployeeModalShown(false)}
      >
        <EmployeeDetails employee={employeeToShow} />
      </Modal>
    </>
  );
};

export default EmployeesPage;
