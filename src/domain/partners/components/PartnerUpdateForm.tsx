import {FC, useMemo} from "react";
import {Input} from "@/common/components/atomic/Input";
import partnerService from "@/domain/partners/services/PartnerService";
import {ArrayElement} from "@/common/utils/types";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    partner: ArrayElement<Awaited<ReturnType<typeof partnerService.getAllIncludeOffers>>>
}

export const PartnerUpdateForm: FC<Props> = ({partner}) => {
    const hasOffers = useMemo(() => partner.offers.length > 0, [partner.offers.length])
    const {label, category, paymentMethod, tooltip} = useStaticValues()
    return (
        <Form
            action='/api/partners/update'
            template='UPDATE'
            multipart
        >
            <input value={partner.id} name='id' className='hidden' type="text"/>
            <input value={partner.logo} name='logoRef' className='hidden' type="text"/>
            <div className='mb-6'>
                <div className='flex flex-col gap-3'>
                    <h3 className='font-medium text-xl'>{label.information}</h3>
                    <div className='w-full'>
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                icon='BuildingOfficeIcon'
                                name='name'
                                label={label.companyName}
                                placeholder={label.companyName}
                                initialValue={partner.name}
                                className={hasOffers ? 'col-span-2' : 'col-span-1'}
                            />
                            <Input
                                icon='MapPinIcon'
                                name='address'
                                label={label.address}
                                placeholder={label.address}
                                initialValue={partner.address}
                            />
                            <Input
                                icon='GlobeAltIcon'
                                name='website'
                                label={label.website}
                                placeholder={label.website}
                                type='url'
                                initialValue={partner.website}
                            />
                            <Input
                                icon='PhotoIcon'
                                name='logo'
                                label={label.logo}
                                placeholder={label.logo}
                                type='file'
                                accept='image'
                                required={false}
                            />
                            <Input
                                icon='SwatchIcon'
                                name='category'
                                label={label.category}
                                placeholder={label.chooseCategory}
                                type='select'
                                tooltip={tooltip.partnerUpdateCategory}
                                options={category}
                                selected={partner.category}
                            />
                            {!hasOffers && (
                                <Input
                                    icon='CreditCardIcon'
                                    name='accepts'
                                    label={label.paymentMethod}
                                    placeholder={label.choosePaymentMethod}
                                    type='select'
                                    options={paymentMethod}
                                    selected={partner.accepts}
                                />
                            )}
                        </div>
                    </div>
                </div>
                <hr className='my-5'/>
                <div className='flex flex-col gap-3'>
                    <h3 className='font-medium text-xl'>{label.representative}</h3>
                    <div className='grid grid-cols-3 gap-3'>
                        <Input
                            icon='UserIcon'
                            name='representativeName'
                            label={label.name}
                            placeholder={label.name}
                            type='text'
                            initialValue={partner.representative.fullName}
                        />
                        <Input
                            icon='EnvelopeIcon'
                            name='representativeEmail'
                            label={label.email}
                            placeholder={label.email}
                            type='email'
                            required={false}
                            initialValue={partner.representative.email}
                        />
                        <Input
                            icon='PhoneIcon'
                            name='representativePhone'
                            label={label.phone}
                            placeholder={label.phone}
                            type='tel'
                            required={false}
                            initialValue={partner.representative.phone}
                        />
                    </div>
                </div>
            </div>
        </Form>
    )
}
