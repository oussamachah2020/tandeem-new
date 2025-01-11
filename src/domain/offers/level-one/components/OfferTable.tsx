import { FC } from "react";
import Datatable from "@/common/components/datatable/Datatable";
import Label from "@/common/components/atomic/Label";
import offerService from "@/domain/offers/shared/services/OfferService";
import { DatatableRow } from "@/common/components/datatable/DatatableRow";
import { DatatableValue } from "@/common/components/datatable/DatatableValue";
import { ImagePreview } from "@/common/components/global/ImagePreview";
import OfferStatus from "@/domain/offers/shared/components/OfferStatus";
import { OfferStatusName } from "@prisma/client";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import { useStaticValues } from "@/common/context/StaticValuesContext";

interface Props {
  offers: Awaited<ReturnType<typeof offerService.getAllForLevel1>>;
  onClick: (offer: any) => void;
  onUpdate: (offer: any) => void;
}

const OfferTable = ({ offers, onClick, onUpdate }: Props) => {
  const { label, action, tooltip, confirmation, category, subCategory } =
    useStaticValues();

  console.log(offers);

  return (
    <Datatable
      headers={[
        label.partner,
        label.title,
        label.category,
        label.subCategory,
        label.status,
      ]}
      isEmpty={offers?.length === 0}
    >
      {offers?.map((offer) => (
        <DatatableRow
          key={offer?.id}
          onClick={() => onClick(offer)}
          onUpdate={() => onUpdate(offer)}
          onDelete={{
            action: "/api/offers/delete",
            resourceId: offer.id,
            message: confirmation.offerLeve1Delete,
          }}
          actionButtons={
            <>
              {offer.status === OfferStatusName.Active && (
                <ConfirmableActionButton
                  action="/api/offers/activation/deactivate"
                  resourceId={offer.id}
                  template={{ icon: "XMarkIcon", text: action.disable }}
                  message={confirmation.offerLevel1Disable}
                  tooltip={tooltip.offerDisable}
                />
              )}
              {offer.status === OfferStatusName.Inactive && (
                <ConfirmableActionButton
                  action="/api/offers/activation/activate"
                  resourceId={offer.id}
                  template={{ icon: "CheckIcon", text: action.enable }}
                  message={confirmation.offerLevel1Enable}
                  tooltip={tooltip.offerEnable}
                />
              )}
            </>
          }
        >
          <DatatableValue>
            <img
              src={offer.partner.logo!}
              className="h-24 w-24 object-cover rounded-md"
            />
          </DatatableValue>
          <DatatableValue>{offer.title}</DatatableValue>
          <DatatableValue>
            <Label>{category[offer.partner.category]}</Label>
          </DatatableValue>
          <DatatableValue>
            <Label>{subCategory[offer.category]}</Label>
          </DatatableValue>
          <DatatableValue>
            <OfferStatus status={offer.status} />
          </DatatableValue>
        </DatatableRow>
      ))}
    </Datatable>
  );
};

export default OfferTable;
