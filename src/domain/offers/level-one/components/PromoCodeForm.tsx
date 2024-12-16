import {Input} from "@/common/components/atomic/Input";
import {EitherInput} from "@/common/components/atomic/EitherInput";
import {ChangeEvent, FC, useCallback, useState} from "react";
import {PromoCodeMultiplePaymentDetails, PromoCodeOnePaymentDetails} from "@/domain/offers/shared/dtos/OfferCreateDto";
import {SubPaymentMethod} from "@prisma/client";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    className?: string
    paymentDetails?: any
    subPaymentMethod?: SubPaymentMethod
}

export const PromoCodeForm: FC<Props> = ({className, paymentDetails, subPaymentMethod}) => {
    const {label} = useStaticValues()
    const [onePromoCode, setOnePromoCode] = useState<PromoCodeOnePaymentDetails>(
        subPaymentMethod === SubPaymentMethod.PromoCode_OneCode && paymentDetails
            ? paymentDetails
            : {code: '', usageLimit: 0, used: 0}
    )
    const [multiplePromoCodes, setMultiplePromoCodes] = useState<PromoCodeMultiplePaymentDetails>(
        subPaymentMethod === SubPaymentMethod.PromoCode_MultipleCodes && paymentDetails
            ? paymentDetails
            : {codes: [], usedCodes: []}
    )

    const handleCodeChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setOnePromoCode(opc => ({
            ...opc,
            code: e.target.value
        }))
    }, [])

    const handleUsageLimitChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setOnePromoCode(opc => ({
            ...opc,
            usageLimit: Number(e.target.value)
        }))
    }, [])

    const handleCodesChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setMultiplePromoCodes(mpc => ({
            ...mpc,
            codes: e.target.value
                .replaceAll(" ", "")
                .split(",")
        }))
    }, [])

    return (
        <EitherInput
            initialActiveSide={subPaymentMethod
                ? subPaymentMethod === SubPaymentMethod.PromoCode_OneCode ? "left" : "right"
                : 'left'}
            className={`grid-cols-7 ${className ?? ''}`}
            labels={[label.onePromoCode, label.multiplePromoCodes]}
            colSpans={['col-span-3', 'col-span-4']}
            nodes={[
                <>
                    <div className='grid grid-cols-2 gap-3'>
                        <Input
                            initialValue={onePromoCode.code}
                            placeholder={label.promoCode}
                            icon='KeyIcon'
                            onChange={handleCodeChange}
                        />
                        <Input
                            initialValue={onePromoCode.usageLimit}
                            placeholder={label.usageLimit}
                            icon='CursorArrowRippleIcon'
                            type='number'
                            min={1}
                            onChange={handleUsageLimitChange}
                        />
                    </div>
                    <input name='paymentDetails' className='hidden' value={JSON.stringify(onePromoCode)}/>
                    <input name='subPaymentMethod' className='hidden' value={SubPaymentMethod.PromoCode_OneCode}/>
                </>,
                <>
                    <Input
                        initialValue={multiplePromoCodes.codes.join(', ')}
                        icon='KeyIcon'
                        placeholder={label.promoCodes}
                        onChange={handleCodesChange}
                    />
                    <input name='paymentDetails' className='hidden' value={JSON.stringify(multiplePromoCodes)}/>
                    <input name='subPaymentMethod' className='hidden' value={SubPaymentMethod.PromoCode_MultipleCodes}/>
                </>
            ]}
        />
    )
}
