import {ChangeEvent, FC, useState} from "react";
import {Input} from "@/common/components/atomic/Input";
import partnerService from "@/domain/partners/services/PartnerService";
import {getLabeledSubCategories} from "@/common/utils/functions";
import {EitherInput} from "@/common/components/atomic/EitherInput";
import {PaymentMethod} from "@prisma/client";
import {PromoCodeForm} from "@/domain/offers/level-one/components/PromoCodeForm";
import {ArrayElement} from "@/common/utils/types";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import CouponForm from "@/domain/offers/level-one/components/CouponForm";

interface Props {
    partners: Awaited<ReturnType<typeof partnerService.getAll>>
}

export const OfferCreateForm: FC<Props> = ({partners}) => {
    const {label, tooltip, subCategory} = useStaticValues()
    const [selectedPartner, setSelectedPartner] = useState<ArrayElement<typeof partners>>()
    const handlePartnerSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        const partner = partners.find((partner) => partner.id === e.currentTarget.value)
        setSelectedPartner(partner);
    }
    return (
        <Form
            className='flex flex-col gap-3'
            action='/api/offers/create'
            validator={() => null}
            template='CREATE'
            multipart
        >
            <Input
                icon='HashtagIcon'
                name='title'
                label={label.title}
                placeholder={label.title}
            />
            <Input
                icon='NewspaperIcon'
                name='description'
                label={label.description}
                placeholder={label.description}
                type='textarea'
            />
            <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                <Input
                    icon='BriefcaseIcon'
                    name='contractorId'
                    label={label.partner}
                    placeholder={label.choosePartner}
                    type='select'
                    onChange={handlePartnerSelect}
                    options={partners.reduce((acc, partner) => ({...acc, [partner.id]: partner.name}), {})}
                />
                <Input
                    icon='SwatchIcon'
                    name='category'
                    label={label.category}
                    placeholder={label.chooseCategory}
                    type='select'
                    options={Object.fromEntries(getLabeledSubCategories(subCategory, selectedPartner?.category))}
                />
                <Input
                    icon='CalendarDaysIcon'
                    name='from'
                    label={label.startDate}
                    type='date'
                    initialValue={new Date()}
                    min={selectedPartner?.contract.from}
                />
                <Input
                    icon='CalendarDaysIcon'
                    name='to'
                    label={label.endDate}
                    type='date'
                    max={selectedPartner?.contract.to}
                />
                <EitherInput
                    className='grid-cols-3 col-span-2'
                    colSpans={['col-span-1', 'col-span-2']}
                    labels={[label.reductionPercentage, `${label.initialPrice}/${label.finalPrice}`]}
                    nodes={[
                        <Input
                            icon='ReceiptPercentIcon'
                            name='discount'
                            placeholder="00.0"
                            type='number'
                            min={1}
                            max={100}
                        />,
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                icon='BanknotesIcon'
                                name='initialPrice'
                                placeholder={label.initialPrice}
                                type='number'
                                min={0}
                            />
                            <Input
                                icon='BanknotesIcon'
                                name='finalPrice'
                                placeholder={label.finalPrice}
                                type='number'
                                min={0}
                            />
                        </div>
                    ]}
                />
                {selectedPartner?.accepts === PaymentMethod.PromoCode && <PromoCodeForm className='col-span-2'/>}
                {selectedPartner?.accepts === PaymentMethod.Coupon && <CouponForm className='col-span-2'/>}
            </div>
            <Input
                icon='CloudArrowUpIcon'
                name='image'
                label={label.image}
                placeholder={label.image}
                type='file'
                accept='image'
                tooltip={tooltip.sixteenByNineAspectRatio}
            />
        </Form>
    )
}
