import {FC, useState} from "react";
import {Input} from "@/common/components/atomic/Input";
import {SubPaymentMethod} from "@prisma/client";
import {CouponPaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {EitherInput} from "@/common/components/atomic/EitherInput";
import {Modal} from "@/common/components/global/Modal";
import useModal from "@/common/hooks/UseModal";
import {GeneratedCouponDataForm} from "@/domain/offers/level-one/components/GeneratedCouponDataForm";
import {PlusIcon} from "@heroicons/react/24/outline";

interface Props {
    className: string
    subPaymentMethod?: SubPaymentMethod
    paymentDetails?: CouponPaymentDetails
}

const CouponForm: FC<Props> = ({className, subPaymentMethod, paymentDetails}) => {
    const {label} = useStaticValues()
    const [generatedCouponData, setGeneratedCouponData] = useState<any>(paymentDetails?.data)
    const [, isGeneratedCouponDataModalShown, toggleIsGeneratedCouponDataModalShown] = useModal(false)
    return (
        <EitherInput
            initialActiveSide={subPaymentMethod
                ? subPaymentMethod === SubPaymentMethod.Coupon_Pregenerated ? "left" : "right"
                : "left"}
            className={`grid-cols-7 ${className ?? ''}`}
            labels={[label.pregeneratedCoupon, label.generatedCoupon]}
            colSpans={['col-span-2', 'col-span-5']}
            nodes={[
                <>
                    <input
                        name='subPaymentMethod'
                        className='hidden'
                        value={SubPaymentMethod.Coupon_Pregenerated}
                    />
                    <Input
                        icon='TicketIcon'
                        name='coupon'
                        type='file'
                        accept='doc'
                        required={!paymentDetails}
                    />
                </>,
                <>
                    <div className='grid grid-cols-3 gap-3'>
                        <Input
                            icon='TicketIcon'
                            name='coupon'
                            type='file'
                            accept='doc'
                            required={!paymentDetails}
                        />
                        <div className='col-span-2 flex gap-3 items-center'>
                            <input
                                className='flex-1 w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-secondary transition duration-200 disabled:bg-gray-50 read-only:bg-gray-50 read-only:focus:ring-0 read-only:cursor-default'
                                placeholder={label.generatedCouponData}
                                readOnly
                                value={JSON.stringify(generatedCouponData)}
                                name='paymentDetails'
                                required
                            />
                            <button
                                className='h-11 bg-gray-100 rounded-lg p-3 hover:brightness-95 transition duration-200 disabled:hover:brightness-100'
                                onClick={(e) => {
                                    e.preventDefault()
                                    toggleIsGeneratedCouponDataModalShown(true)
                                }}
                            >
                                <PlusIcon className='w-5 h-5'/>
                            </button>
                        </div>
                    </div>
                    <input name='subPaymentMethod' className='hidden' value={SubPaymentMethod.Coupon_Generated}/>
                    <Modal
                        title={label.generatedCouponData}
                        isShown={isGeneratedCouponDataModalShown}
                        onClose={() => toggleIsGeneratedCouponDataModalShown(false)}
                        width='w-4/12'
                    >
                        <GeneratedCouponDataForm
                            jsonData={generatedCouponData}
                            onSave={(data) => {
                                setGeneratedCouponData(data)
                                toggleIsGeneratedCouponDataModalShown(false)
                            }}
                        />
                    </Modal>
                </>
            ]}
        />
    )
}

export default CouponForm