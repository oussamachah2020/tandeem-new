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

const MOCK_CUSTOMERS = [
  {
    id: 1,
    logo: "https://via.placeholder.com/40", // Mock logo URL
    name: "Tech Solutions Inc.",
    address: "123 Tech Street, Silicon Valley, CA",
    category: "technology",
    contract: { status: "active", duration: "12-month" },
  },
  {
    id: 2,
    logo: "https://via.placeholder.com/40",
    name: "Green Farms Co.",
    address: "456 Greenway Drive, Austin, TX",
    category: "agriculture",
    contract: { status: "expired", duration: "6-month" },
  },
  {
    id: 3,
    logo: "https://via.placeholder.com/40",
    name: "HealthFirst Clinics",
    address: "789 Wellness Ave, Miami, FL",
    category: "healthcare",
    contract: { status: "active", duration: "24-month" },
  },
  {
    id: 4,
    logo: "https://via.placeholder.com/40",
    name: "EduSpark Academy",
    address: "101 Knowledge Lane, Boston, MA",
    category: "education",
    contract: { status: "active", duration: "18-month" },
  },
  {
    id: 5,
    logo: "https://via.placeholder.com/40",
    name: "UrbanStyle Architects",
    address: "202 Design Blvd, Chicago, IL",
    category: "architecture",
    contract: { status: "pending", duration: "12-month" },
  },
  {
    id: 6,
    logo: "https://via.placeholder.com/40",
    name: "AutoDrive Motors",
    address: "303 Engine Road, Detroit, MI",
    category: "automotive",
    contract: { status: "active", duration: "36-month" },
  },
  {
    id: 7,
    logo: "https://via.placeholder.com/40",
    name: "Culinary Creations",
    address: "404 Foodie St, New Orleans, LA",
    category: "hospitality",
    contract: { status: "trial", duration: "1-month" },
  },
];

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
      isEmpty={MOCK_CUSTOMERS.length === 0}
    >
      {MOCK_CUSTOMERS.map((customer, idx) => (
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
            {/* <Label>{category[customer.category]}</Label> */}
          </DatatableValue>
          <DatatableValue>
            <ContractStatus status={"Active"} />
          </DatatableValue>
        </DatatableRow>
      ))}
    </Datatable>
  );
};

export default CustomerTable