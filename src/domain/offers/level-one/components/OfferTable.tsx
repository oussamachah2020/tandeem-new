import {FC} from "react";
import Datatable from "@/common/components/datatable/Datatable";
import Label from "@/common/components/atomic/Label";
import offerService from "@/domain/offers/shared/services/OfferService";
import {DatatableRow} from "@/common/components/datatable/DatatableRow";
import {DatatableValue} from "@/common/components/datatable/DatatableValue";
import {ImagePreview} from "@/common/components/global/ImagePreview";
import OfferStatus from "@/domain/offers/shared/components/OfferStatus";
import {OfferStatusName} from "@prisma/client";
import ConfirmableActionButton from "@/common/components/atomic/ConfirmableActionButton";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offers: Awaited<ReturnType<typeof offerService.getAllForLevel1>>
    onClick: (offer: any) => void
    onUpdate: (offer: any) => void
}

const MOCK_OFFERS = [
  {
    id: "offer1",
    partner: {
      logo: "https://example.com/logo1.png",
      category: "electronics", // Key for category lookup
    },
    title: "Smartphone Sale",
    category: "phones", // Key for subCategory lookup
    subCategory: "smartphones",
    status: "Active", // Assuming OfferStatusName includes "Active"
  },
  {
    id: "offer2",
    partner: {
      logo: "https://example.com/logo2.png",
      category: "furniture",
    },
    title: "Office Chair Discount",
    category: "chairs",
    subCategory: "office chairs",
    status: "Inactive", // Assuming OfferStatusName includes "Inactive"
  },
  {
    id: "offer3",
    partner: {
      logo: "https://example.com/logo3.png",
      category: "appliances",
    },
    title: "Microwave Clearance",
    category: "kitchen",
    subCategory: "microwaves",
    status: "Active",
  },
  {
    id: "offer4",
    partner: {
      logo: "https://example.com/logo4.png",
      category: "fashion",
    },
    title: "Winter Jackets Promo",
    category: "clothing",
    subCategory: "jackets",
    status: "Inactive",
  },
];
  
  

const OfferTable: FC<Props> = ({offers, onClick, onUpdate}) => {
    const {label, action, tooltip, confirmation, category, subCategory} = useStaticValues()
    return (
      <Datatable
        headers={[
          label.partner,
          label.title,
          label.category,
          label.subCategory,
          label.status,
        ]}
        isEmpty={MOCK_OFFERS.length === 0}
      >
        {MOCK_OFFERS.map((offer, idx) => (
          <DatatableRow
            key={idx}
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
              <ImagePreview imageRef={offer.partner.logo!} />
            </DatatableValue>
            <DatatableValue>{offer.title}</DatatableValue>
            <DatatableValue>
              {/* <Label>{category[offer.partner.category]}</Label> */}
            </DatatableValue>
            <DatatableValue>
              {/* <Label>{subCategory[offer.category]}</Label> */}
            </DatatableValue>
            <DatatableValue>
              <OfferStatus status={"Active"} />
            </DatatableValue>
          </DatatableRow>
        ))}
      </Datatable>
    );
}

export default OfferTable