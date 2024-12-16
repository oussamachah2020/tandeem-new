import {FC} from "react";
import {CouponPaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";
import {getDownloadUrl} from "@/common/utils/functions";
import {CodeBracketSquareIcon, EyeIcon} from "@heroicons/react/24/outline";
import Link from "@/common/components/atomic/Link";
import {SubPaymentMethod} from "@prisma/client";
import {Modal} from "@/common/components/global/Modal";
import {GeneratedCouponDataForm} from "@/domain/offers/level-one/components/GeneratedCouponDataForm";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import useModal from "@/common/hooks/UseModal";

interface Props {
    paymentDetails: any,
    subPaymentMethod: SubPaymentMethod
}

const CouponDetails: FC<Props> = ({paymentDetails, subPaymentMethod}) => {
    const {label} = useStaticValues()
    const [, isGeneratedCouponDataModalShown, toggleIsGeneratedCouponDataModalShown] = useModal(false)
    const details = paymentDetails as CouponPaymentDetails
    if (subPaymentMethod === SubPaymentMethod.Coupon_Pregenerated) {
        return (
            <Link href={getDownloadUrl(details.couponRef)}>
                <EyeIcon className='w-5 h-5'/>
            </Link>
        )
    } else {
        return (
            <div className='flex gap-4'>
                <Link href={getDownloadUrl(details.couponRef)}>
                    <EyeIcon className='w-5 h-5'/>
                </Link>
                <Link
                    className='border-l px-4'
                    href='#'
                    internal
                    onClick={() => toggleIsGeneratedCouponDataModalShown(true)}
                >
                    <CodeBracketSquareIcon className='w-5 h-5'/>
                </Link>
                <Modal
                    title={label.generatedCouponData}
                    isShown={isGeneratedCouponDataModalShown}
                    onClose={() => toggleIsGeneratedCouponDataModalShown(false)}
                    width='w-4/12'
                >
                    <GeneratedCouponDataForm jsonData={details.data}/>
                </Modal>
            </div>
        )
    }
}

export default CouponDetails