import {Input} from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";

export const CustomerCreateForm = () => {
    const {label, category, tooltip} = useStaticValues()
    return (
        <Form
            action='/api/customers/create'
            template='CREATE'
            multipart
        >
            <div className="flex flex-col gap-3">
                <h3 className="font-medium text-xl">{label.information}</h3>
                <div className="w-full">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            icon="BuildingOfficeIcon"
                            name="name"
                            label={label.name}
                            placeholder={label.name}
                        />
                        <Input
                            icon="MapPinIcon"
                            name="address"
                            label={label.address}
                            placeholder={label.address}
                        />
                        <Input
                            icon="EnvelopeIcon"
                            name='email'
                            label={label.email}
                            placeholder={label.email}
                            type="email"
                            tooltip={tooltip.customerAccountEmail}
                        />
                        <Input
                            icon="GlobeAltIcon"
                            name="website"
                            label={label.website}
                            placeholder={label.website}
                            type="url"
                        />
                        <Input
                            icon="PhotoIcon"
                            name="logo"
                            label={label.logo}
                            placeholder={label.logo}
                            type="file"
                            accept="image"
                        />
                        <Input
                            icon="SwatchIcon"
                            name="category"
                            label={label.category}
                            placeholder={label.chooseCategory}
                            options={category}
                            type="select"
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
                    placeholder='e.g. 50'
                    type='number'
                />
            </div>
            <hr className='my-5'/>
            <div className='flex flex-col gap-3'>
                <h3 className='font-medium text-xl'>{label.contract}</h3>
                <div className='grid grid-cols-3 gap-3'>
                    <Input
                        icon='DocumentTextIcon'
                        name='contractScan'
                        label={label.scan}
                        placeholder={label.scan}
                        type='file'
                        accept='doc'
                    />
                    <Input
                        icon='CalendarDaysIcon'
                        name='contractFrom'
                        label={label.startDate}
                        type='date'
                        initialValue={Date.now()}
                    />
                    <Input
                        icon='CalendarDaysIcon'
                        name='contractTo'
                        label={label.endDate}
                        type='date'
                        min={Date.now()}
                    />
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
                    />
                    <Input
                        icon='PhoneIcon'
                        name='representativePhone'
                        label={label.phone}
                        placeholder={label.phone}
                        type='tel'
                        required={false}
                    />
                    <Input
                        icon='EnvelopeIcon'
                        name='representativeEmail'
                        label={label.email}
                        placeholder={label.email}
                        type='email'
                        required={false}
                    />
                </div>
            </div>
        </Form>
    )
}