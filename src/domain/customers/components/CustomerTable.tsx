import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import ContractStatus from "@/domain/contracts/components/ContractStatus";
import customerService from "@/domain/customers/services/CustomerService";
import Label from "@/common/components/atomic/Label";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    customers: Awaited<ReturnType<typeof customerService.getAll>>
    onClick: (customer: any) => void
    onUpdate: (customer: any) => void
}


const CustomerTable: FC<Props> = ({ customers, onUpdate, onClick }) => {
  const { label, category, confirmation } = useStaticValues();
  return (
    <Datatable
      headers={[
        label.companyName,
        label.address,
        label.category,
        label.contract,
      ]}
      isEmpty={customers.length === 0}
    >
      {customers.map((customer, idx) => (
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
            <ImagePreview imageRef={customer.logo} />
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

export default CustomerTable