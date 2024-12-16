import { SubPaymentMethod } from "@prisma/client";
import { FC } from "react";
import {
  PromoCodeMultiplePaymentDetails,
  PromoCodeOnePaymentDetails,
} from "@/domain/offers/shared/dtos/OfferCreateDto";
import Label from "@/common/components/atomic/Label";

interface Props {
  subPaymentMethod: SubPaymentMethod;
  paymentDetails: any;
}

const PromoCodeDetails: FC<Props> = ({ subPaymentMethod, paymentDetails }) => {
  if (subPaymentMethod === SubPaymentMethod.PromoCode_OneCode) {
    const details = paymentDetails as PromoCodeOnePaymentDetails;
    return (
      <div className="flex items-center text-sm">
        <Label>{details.code}</Label>
        <div className="flex gap-1 border-x border-gray-400 px-2 mx-2">
          <span>Limite d'usage:</span>
          {details.usageLimit}
        </div>
        <div className="flex gap-1">
          <span>Utilisé:</span>
          {details.used}
        </div>
      </div>
    );
  }
  if (subPaymentMethod === SubPaymentMethod.PromoCode_MultipleCodes) {
    const details = paymentDetails as PromoCodeMultiplePaymentDetails;
    return (
      <div className="w-full">
        <div className="flex gap-1 flex-wrap">
          {details.codes.slice(0, 5).map((code, idx) => (
            <Label
              key={idx}
              textSize="text-[13px]"
              textColor={
                details.usedCodes.includes(code) ? "text-gray-400" : undefined
              }
            >
              {code}
            </Label>
          ))}
          {details.codes.length > 6 && <pre>. . .</pre>}
        </div>
      </div>
    );
  }
  return <></>;
};

export default PromoCodeDetails;
