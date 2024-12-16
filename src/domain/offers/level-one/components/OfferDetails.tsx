import {FC, useMemo} from "react";
import {formatDate, getDownloadUrl} from "@/common/utils/functions";
import Label from "@/common/components/atomic/Label";
import {ArrowRightIcon} from "@heroicons/react/24/outline";
import offerService from "@/domain/offers/shared/services/OfferService";
import DetailsTable from "@/common/components/details-table/DetailsTable";
import DetailsRow from "@/common/components/details-table/DetailsRow";
import OfferStatus from "@/domain/offers/shared/components/OfferStatus";
import PromoCodeDetails from "@/domain/offers/level-one/components/PromoCodeDetails";
import {ArrayElement} from "@/common/utils/types";
import {SubPaymentMethod} from "@prisma/client";
import CouponDetails from "@/domain/offers/level-one/components/CouponDetails";
import {PromoCodeMultiplePaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offer: ArrayElement<Awaited<ReturnType<typeof offerService.getAllForLevel1>>>
}

const OfferDetails: FC<Props> = ({offer}) => {
    const {subCategory} = useStaticValues()
    const isPromoCode = useMemo(() => {
        return (
            offer.subPaymentMethod === SubPaymentMethod.PromoCode_OneCode ||
            offer.subPaymentMethod === SubPaymentMethod.PromoCode_MultipleCodes
        )
    }, [offer.subPaymentMethod]);
    const isCoupon = useMemo(() => {
        return (
            offer.subPaymentMethod === SubPaymentMethod.Coupon_Generated ||
            offer.subPaymentMethod === SubPaymentMethod.Coupon_Pregenerated
        )
    }, [offer.subPaymentMethod])

    const isMultiplePromoCodes = useMemo(() => {
        return offer.subPaymentMethod === SubPaymentMethod.PromoCode_MultipleCodes
    }, [offer.subPaymentMethod]);
    return (
        <div className='flex flex-col gap-4'>
            <div className='grid grid-cols-5 gap-8'>
                <img
                    className='col-span-2 rounded-xl'
                    src={getDownloadUrl(offer.image)}
                    alt="Thumbnail"
                />
                <DetailsTable className='col-span-3'>
                    <DetailsRow title='Partenaire'>
                        <div
                            className='p-1 h-16 w-16 border rounded-lg bg-contain bg-center bg-no-repeat'
                            style={{backgroundImage: `url(${getDownloadUrl(offer.partner.logo)})`}}
                        />
                    </DetailsRow>
                    <DetailsRow title='Titre'>
                        {offer.title}
                    </DetailsRow>
                    <DetailsRow
                        title='Description'
                        classname='leading-loose text-justify'
                    >
                        {offer.description}
                    </DetailsRow>
                    <DetailsRow title='Catégorie'>
                        <Label>
                            {subCategory[offer.category]}
                        </Label>
                    </DetailsRow>
                    <DetailsRow title='Status'>
                        <OfferStatus status={offer.status}/>
                    </DetailsRow>
                    <DetailsRow
                        title='Validité'
                        classname='flex gap-3 items-center'
                    >
                        {formatDate(offer.from)}
                        <ArrowRightIcon className='w-4 h-4'/>
                        {formatDate(offer.to)}
                    </DetailsRow>
                    {isPromoCode && (
                        <DetailsRow title='Code Promo'>
                            <PromoCodeDetails
                                subPaymentMethod={offer.subPaymentMethod}
                                paymentDetails={offer.paymentDetails}
                            />
                        </DetailsRow>
                    )}
                    {isMultiplePromoCodes && (
                        <DetailsRow title='Codes promo utilisés'>
                            {(offer.paymentDetails as any as PromoCodeMultiplePaymentDetails).usedCodes.length}
                        </DetailsRow>
                    )}
                    {isCoupon && (
                        <DetailsRow title='Coupon'>
                            <CouponDetails
                                subPaymentMethod={offer.subPaymentMethod}
                                paymentDetails={offer.paymentDetails}
                            />
                        </DetailsRow>
                    )}
                    {offer.discount && (
                        <DetailsRow title='Taux de réduction'>
                            {offer.discount}%
                        </DetailsRow>
                    )}
                    {offer.initialPrice && offer.finalPrice && (
                        <DetailsRow title='Prix' classname='flex gap-4 items-center'>
                            <Label fontSize='font-medium' textColor='text-primary'>
                                {offer.finalPrice} MAD
                            </Label>
                            <span className='font-medium text-sm line-through decoration-secondary decoration-2'>
                                {offer.initialPrice} MAD
                            </span>
                        </DetailsRow>
                    )}
                </DetailsTable>
            </div>
        </div>
    )
}

export default OfferDetails
