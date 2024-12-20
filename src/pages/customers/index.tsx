import { useEffect, useState } from "react";
import { Main } from "@/common/components/global/Main";
import { SectionName } from "@/common/security/Sections";
import { NextPage } from "next";
import { Modal } from "@/common/components/global/Modal";
import { CustomerCreateForm } from "@/domain/customers/components/CustomerCreateForm";
import CustomerTable from "@/domain/customers/components/CustomerTable";
import CustomerDetails from "@/domain/customers/components/CustomerDetails";
import useSearch from "@/common/hooks/UseSearch";
import ActionBar from "@/common/components/global/ActionBar";
import { CustomerUpdateForm } from "@/domain/customers/components/CustomerUpdateForm";
import FilterGroup from "@/common/components/filter/FilterGroup";
import Filter from "@/common/components/filter/Filter";
import useFilter from "@/common/hooks/UseFilter";
import useModal from "@/common/hooks/UseModal";
import { labeledContractStatuses } from "@/common/utils/statics";
import { ArrayElement } from "@/common/utils/types";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import { RefreshCcw } from "lucide-react";

const Customers: NextPage = () => {
  const { category, action, label } = useStaticValues();
  const { authenticatedUser, accessToken } = useAuthStore();
  const [, isAddCustomerModalShown, toggleAddCustomerModal] = useModal(false);
  const [customerToShow, isCustomerModalShown, toggleCustomerModal] =
    useModal<any>();
  const [customerToUpdate, isEditCustomerModalShown, toggleEditCustomerModal] =
    useModal<any>();

  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchResultedCustomers, onSearchInputChange] = useSearch(customers, [
    "name",
    "address",
  ]);
  const [filteredCustomers, onFilterValueChange] = useFilter(
    searchResultedCustomers,
    ["category", "contract.status" as any]
  );

  // Fetch customers data from an API endpoint
  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/customers/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch customers.");
      const data = await response.json();
      setCustomers(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [authenticatedUser]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center w-full bg-white">
        <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Main section={SectionName.Customers} user={authenticatedUser}>
        <ActionBar
          action={{
            text: action.customerAdd,
            onClick: () => toggleAddCustomerModal(true),
          }}
          onSearchInputChange={onSearchInputChange}
        />
        <FilterGroup>
          <Filter
            label={label.category}
            icon="SwatchIcon"
            values={Object.entries(category)}
            onValueChange={(e: any) => onFilterValueChange("category", e)}
          />
          <Filter
            label={label.contract}
            icon="ArrowPathIcon"
            values={labeledContractStatuses}
            onValueChange={(e: any) =>
              onFilterValueChange("contract.status" as any, e)
            }
          />
        </FilterGroup>
        <CustomerTable
          customers={filteredCustomers}
          onClick={(customer: any) => toggleCustomerModal(true, customer)}
          onUpdate={(customer: any) => toggleEditCustomerModal(true, customer)}
        />
      </Main>
      <Modal
        title={action.customerAdd}
        isShown={isAddCustomerModalShown}
        onClose={() => toggleAddCustomerModal(false)}
      >
        <CustomerCreateForm onClose={() => toggleAddCustomerModal(false)} />
      </Modal>
      <Modal
        title={action.customerUpdate}
        isShown={isEditCustomerModalShown}
        onClose={() => toggleEditCustomerModal(false)}
      >
        {customerToUpdate && <CustomerUpdateForm customer={customerToUpdate} />}
      </Modal>
      <Modal
        title={action.customerDetail}
        isShown={isCustomerModalShown}
        onClose={() => toggleCustomerModal(false)}
      >
        {customerToShow && <CustomerDetails customer={customerToShow} />}
      </Modal>
    </>
  );
};

export default Customers;
