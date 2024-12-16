import {FC} from "react";
import {Input} from "@/common/components/atomic/Input";
import {ArrayElement} from "@/common/utils/types";
import customerService from "@/domain/customers/services/CustomerService";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    customer: ArrayElement<Awaited<ReturnType<typeof customerService.getAll>>>
}

export const CustomerUpdateForm: FC<Props> = ({customer}) => {
    const {label, category, tooltip} = useStaticValues()
    return (
        <Form action='/api/customers/update' multipart template='UPDATE'>
            <input className='hidden' name='id' value={customer.id}/>
            <input className='hidden' name='logoRef' value={customer.logo}/>
            <div className='mb-6'>
                <div className='flex flex-col gap-3'>
                    <h3 className='font-medium text-xl'>{label.information}</h3>
                    <div>
                        <Input
                            icon='BuildingOfficeIcon'
                            name='name'
                            label={label.companyName}
                            placeholder={label.companyName}
                            initialValue={customer.name}
                        />
                    </div>
                    <div className='w-full'>
                        <div className='grid grid-cols-2 gap-4'>
                            <Input
                                icon='MapPinIcon'
                                name='address'
                                label={label.address}
                                placeholder={label.address}
                                initialValue={customer.address}
                            />
                            <Input
                                icon='GlobeAltIcon'
                                name='website'
                                label={label.website}
                                placeholder={label.website}
                                type='url'
                                initialValue={customer.website}
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
                                tooltip={tooltip.customerUpdateCategory}
                                options={category}
                                selected={customer.category}
                            />
                        </div>
                    </div>
                </div>
                <hr className='my-5'/>
                <div className='flex flex-col gap-3'>
                    <h3 className='font-medium text-xl'>{label.conditions}</h3>
                    <Input
                        icon='UsersIcon'
                        name='maxEmployees'
                        label={label.maxNumberOfEmployees}
                        initialValue={customer.maxEmployees}
                        type='number'
                    />
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
                            initialValue={customer.representative.fullName}
                        />
                        <Input
                            icon='PhoneIcon'
                            name='representativePhone'
                            label={label.phone}
                            placeholder={label.phone}
                            type='tel'
                            initialValue={customer.representative.phone}
                        />
                        <Input
                            icon='EnvelopeIcon'
                            name='representativeEmail'
                            label={label.email}
                            placeholder={label.email}
                            type='email'
                            initialValue={customer.representative.email}
                        />
                    </div>
                </div>
            </div>
        </Form>
    )
}