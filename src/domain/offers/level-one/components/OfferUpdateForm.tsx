import {FC} from "react";
import {Input} from "@/common/components/atomic/Input";
import {getLabeledSubCategories} from "@/common/utils/functions";
import {EitherInput} from "@/common/components/atomic/EitherInput";
import {PaymentMethod} from "@prisma/client";
import offerService from "@/domain/offers/shared/services/OfferService";
import {PromoCodeForm} from "@/domain/offers/level-one/components/PromoCodeForm";
import {ArrayElement} from "@/common/utils/types";
import CouponForm from "@/domain/offers/level-one/components/CouponForm";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    offer: ArrayElement<Awaited<ReturnType<typeof offerService.getAllForLevel1>>>
}

export const OfferUpdateForm: FC<Props> = ({offer}) => {
    const {label, subCategory} = useStaticValues()
    return (
        <Form
            action='/api/offers/update'
            className='flex flex-col gap-3'
            template='UPDATE'
            multipart
        >
            <input value={offer.id} name='offerId' className='hidden' type="text"/>
            <input value={offer.image} name='imageRef' className='hidden' type="text"/>
            <Input
                name='title'
                label={label.title}
                placeholder={label.title}
                icon='HashtagIcon'
                initialValue={offer.title}
            />
            <Input
                name='description'
                label={label.description}
                placeholder={label.description}
                icon='NewspaperIcon'
                type='textarea'
                initialValue={offer.description}
            />
            <div className='grid grid-cols-2 gap-x-4 gap-y-3'>
                <Input
                    label={label.partner}
                    icon='BriefcaseIcon'
                    type='select'
                    disabled
                    options={{[offer.partner.id]: offer.partner.name}}
                    selected={offer.partner.name}
                />
                <Input
                    name='category'
                    label={label.category}
                    placeholder={label.chooseCategory}
                    icon='SwatchIcon'
                    type='select'
                    options={Object.fromEntries(getLabeledSubCategories(subCategory, offer.partner.category))}
                    selected={offer.category}
                />
                <Input
                    name='from'
                    label={label.startDate}
                    icon='CalendarDaysIcon'
                    type='date'
                    initialValue={new Date(offer.from)}
                    min={offer.partner.contract.from}
                />
                <Input
                    name='to'
                    label={label.endDate}
                    icon='CalendarDaysIcon'
                    type='date'
                    initialValue={new Date(offer.to)}
                    max={offer.partner.contract.to}
                />
                <EitherInput
                    initialActiveSide={offer.discount ? 'left' : 'right'}
                    className='grid-cols-3 col-span-2'
                    colSpans={['col-span-1', 'col-span-2']}
                    labels={[label.reductionPercentage, `${label.initialPrice}/${label.finalPrice}`]}
                    nodes={[
                        <Input
                            name='discount'
                            placeholder="00.0"
                            icon='ReceiptPercentIcon'
                            type='number'
                            initialValue={offer.discount}
                            min={1}
                            max={100}
                        />,
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                name='initialPrice'
                                placeholder={label.initialPrice}
                                icon='BanknotesIcon'
                                type='number'
                                initialValue={offer.initialPrice}
                                min={0}
                            />
                            <Input
                                name='finalPrice'
                                placeholder={label.finalPrice}
                                icon='BanknotesIcon'
                                type='number'
                                initialValue={offer.finalPrice}
                                min={0}
                            />
                        </div>
                    ]}
                />
                {offer.partner.accepts === PaymentMethod.PromoCode &&
                    <PromoCodeForm
                        className='col-span-2'
                        paymentDetails={offer.paymentDetails}
                        subPaymentMethod={offer.subPaymentMethod}
                    />}
                {offer.partner.accepts === PaymentMethod.Coupon &&
                    <CouponForm
                        className='col-span-2'
                        subPaymentMethod={offer.subPaymentMethod}
                        paymentDetails={offer.paymentDetails as any}
                    />}
            </div>
            <Input
                name='image'
                label="Miniature"
                placeholder="Uploader une miniature"
                icon='CloudArrowUpIcon'
                type='file'
                accept='image'
                required={false}
            />
        </Form>
    )
}

export default OfferUpdateForm