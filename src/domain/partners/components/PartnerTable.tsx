import { FC, useMemo, useState } from "react";
import Datatable from "@/common/components/datatable/Datatable";
import ContractStatus from "@/domain/contracts/components/ContractStatus";
import Label from "@/common/components/atomic/Label";
import partnerService from "@/domain/partners/services/PartnerService";
import { DatatableRow } from "@/common/components/datatable/DatatableRow";
import { DatatableValue } from "@/common/components/datatable/DatatableValue";
import { ImagePreview } from "@/common/components/global/ImagePreview";
import { useStaticValues } from "@/common/context/StaticValuesContext";

interface Props {
  partners: Awaited<ReturnType<typeof partnerService.getAllIncludeOffers>>;
  onClick: (partner: any) => void;
  onUpdate: (partner: any) => void;
}

type SortField = "name" | "address" | "category" | "contract";

const PartnerTable: FC<Props> = ({ partners, onUpdate, onClick }) => {
  const { label, category, paymentMethod, confirmation } = useStaticValues();
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

  const sortedPartners = useMemo(() => {
    return [...partners].sort((a, b) => {
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
  }, [sortField, sortOrder, partners]);

  return (
    <Datatable
      headers={[
        label.companyName,
        label.address,
        label.category,
        label.paymentMethod,
        label.contract,
      ]}
      onSortChange={(headerIndex) => {
        const fields: SortField[] = ["name", "address", "category", "contract"];
        handleSortChange(fields[headerIndex]);
      }}
      isEmpty={sortedPartners.length === 0}
    >
      {sortedPartners.map((partner, idx) => (
        <DatatableRow
          key={idx}
          onClick={() => onClick(partner)}
          onUpdate={() => onUpdate(partner)}
          onDelete={{
            action: "/api/partners/delete",
            resourceId: partner.id,
            message: confirmation.partnerDelete,
          }}
        >
          <DatatableValue className="flex items-center gap-5">
            <img
              src={partner.logo}
              alt="partner-logo"
              className="w-24 h-24 rounded-md object-contain"
            />
            {partner.name}
          </DatatableValue>
          <DatatableValue className="truncate w-[180px]">
            {partner.address.substring(0, 12)}...{" "}
          </DatatableValue>
          <DatatableValue>
            <Label>{category[partner.category]}</Label>
          </DatatableValue>
          <DatatableValue>
            <Label>{paymentMethod[partner.accepts as never]}</Label>
          </DatatableValue>
          <DatatableValue>
            <ContractStatus status={partner.contract.status} />
          </DatatableValue>
        </DatatableRow>
      ))}
    </Datatable>
  );
};

export default PartnerTable;
