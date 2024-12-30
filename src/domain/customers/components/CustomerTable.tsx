import { FC, useMemo, useState } from "react";
import Datatable from "@/common/components/datatable/Datatable";
import ContractStatus from "@/domain/contracts/components/ContractStatus";
import customerService from "@/domain/customers/services/CustomerService";
import Label from "@/common/components/atomic/Label";
import { DatatableRow } from "@/common/components/datatable/DatatableRow";
import { ImagePreview } from "@/common/components/global/ImagePreview";
import { DatatableValue } from "@/common/components/datatable/DatatableValue";
import { useStaticValues } from "@/common/context/StaticValuesContext";

interface Props {
  customers: Awaited<ReturnType<typeof customerService.getAll>>;
  onClick: (customer: any) => void;
  onUpdate: (customer: any) => void;
}

type SortField = "name" | "address" | "category" | "contract";

const CustomerTable: FC<Props> = ({ customers, onUpdate, onClick }) => {
  const { label, category, confirmation } = useStaticValues();
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (field: SortField) => {
    if (field === "address") {
      // Always sort by ascending order for address
      setSortField("address");
      setSortOrder("asc");
    } else if (sortField === field) {
      // Toggle sort order if the same field is clicked
      setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
    } else {
      // Set new field and default to ascending order
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedCustomers = useMemo(() => {
    return [...customers].sort((a, b) => {
      const aValue = (a?.[sortField] || "").toString().toLowerCase();
      const bValue = (b?.[sortField] || "").toString().toLowerCase();

      if (sortField === "address") {
        // Always sort addresses in ascending order
        return aValue.localeCompare(bValue);
      }

      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });
  }, [sortField, sortOrder, customers]);

  console.log(customers);

  return (
    <Datatable
      headers={[
        label.companyName,
        label.address,
        label.category,
        label.contract,
      ]}
      onSortChange={(headerIndex) => {
        const fields: SortField[] = ["name", "address", "category", "contract"];
        handleSortChange(fields[headerIndex]);
      }}
      isEmpty={sortedCustomers.length === 0}
    >
      {sortedCustomers.map((customer, idx) => (
        <DatatableRow
          key={idx}
          onClick={() => onClick(customer)}
          onUpdate={() => onUpdate(customer)}
          onDelete={{
            action: "/api/customers/delete",
            resourceId: customer.id.toString(),
            message: confirmation.customerDelete,
          }}
        >
          <DatatableValue className="flex items-center gap-5">
            <img
              src={customer.logo}
              alt="logo"
              className="w-20 rounded-md h-20 object-contain"
            />
            {customer.name}
          </DatatableValue>
          <DatatableValue>{customer.address}</DatatableValue>
          <DatatableValue>
            <Label>{category[customer.category]}</Label>
          </DatatableValue>
          <DatatableValue>
            <ContractStatus status={customer.contract.status} />
          </DatatableValue>
        </DatatableRow>
      ))}
    </Datatable>
  );
};

export default CustomerTable;
