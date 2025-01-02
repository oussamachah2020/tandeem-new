import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import { NextPage } from "next";
import { Modal } from "@/common/components/global/Modal";
import PartnerTable from "@/domain/partners/components/PartnerTable";
import { PartnerCreateForm } from "@/domain/partners/components/PartnerCreateForm";
import partnerService from "@/domain/partners/services/PartnerService";
import PartnerDetails from "@/domain/partners/components/PartnerDetails";
import ActionBar from "@/common/components/global/ActionBar";
import useSearch from "@/common/hooks/UseSearch";
import { PartnerUpdateForm } from "@/domain/partners/components/PartnerUpdateForm";
import Filter from "@/common/components/filter/Filter";
import FilterGroup from "@/common/components/filter/FilterGroup";
import useFilter from "@/common/hooks/UseFilter";
import useModal from "@/common/hooks/UseModal";
import {
  labeledContractStatuses,
  labeledPaymentMethods,
} from "@/common/utils/statics";
import { ArrayElement } from "@/common/utils/types";
import { useStaticValues } from "@/common/context/StaticValuesContext";
import { useAuthStore } from "@/zustand/auth-store";
import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";

interface Props {
  partners: Awaited<ReturnType<typeof partnerService.getAllIncludeOffers>>;
}

const Partners: NextPage<Props> = () => {
  const { label, action, category } = useStaticValues();
  const [, isAddPartnerModalShown, toggleAddPartnerModal] = useModal(false);
  const [partnerToShow, isPartnerModalShown, togglePartnerModal] =
    useModal<ArrayElement<typeof partners>>();
  const [partnerToUpdate, isEditPartnerModalShown, toggleEditPartnerModal] =
    useModal<ArrayElement<typeof partners>>();
  const { accessToken, authenticatedUser } = useAuthStore();
  const [partners, setPartners] = useState<any[]>([]);
  const [searchResultedPartners, onSearchInputChange] = useSearch(partners, [
    "name",
    "address",
  ]);

  const [filteredPartners, onFilterValueChange] = useFilter(
    searchResultedPartners,
    ["category", "contract.status" as any, "accepts"]
  );
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPartners = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/partners/read", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch customers.");
      const data = await response.json();
      setPartners(data);
    } catch (err: any) {
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [authenticatedUser]);

  return (
    <>
      <Main section={SectionName.Partners} user={authenticatedUser}>
        <ActionBar
          action={{
            text: action.partnerAdd,
            onClick: () => toggleAddPartnerModal(true),
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
          <Filter
            label={label.paymentMethod}
            icon="CreditCardIcon"
            values={labeledPaymentMethods}
            onValueChange={(e: any) => onFilterValueChange("accepts", e)}
          />
        </FilterGroup>
        {loading ? (
          <div className="h-40 flex justify-center items-center w-full bg-white">
            <RefreshCcw className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <PartnerTable
            partners={filteredPartners}
            onClick={(partner: any) => togglePartnerModal(true, partner)}
            onUpdate={(partner: any) => toggleEditPartnerModal(true, partner)}
          />
        )}
      </Main>
      <Modal
        title={action.partnerAdd}
        isShown={isAddPartnerModalShown}
        onClose={() => toggleAddPartnerModal(false)}
      >
        <PartnerCreateForm onClose={() => toggleAddPartnerModal(false)} />
      </Modal>
      <Modal
        title={action.partnerUpdate}
        isShown={isEditPartnerModalShown}
        onClose={() => toggleEditPartnerModal(false)}
      >
        {partnerToUpdate && (
          <PartnerUpdateForm
            onClose={() => toggleEditPartnerModal(false)}
            partner={partnerToUpdate}
          />
        )}
      </Modal>
      <Modal
        title={action.partnerDetail}
        isShown={isPartnerModalShown}
        onClose={() => togglePartnerModal(false)}
      >
        {partnerToShow && <PartnerDetails partner={partnerToShow} />}
      </Modal>
    </>
  );
};
export default Partners;
