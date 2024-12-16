import {Input} from "@/common/components/atomic/Input";
import {ArrayElement} from "@/common/utils/types";
import adminService from "@/domain/admins/services/AdminService";
import {FC} from "react";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";


interface Props {
    admin: ArrayElement<Awaited<ReturnType<typeof adminService.getAll>>>
}

const AdminUpdateForm: FC<Props> = ({admin}) => {
    const {label} = useStaticValues()
    return (
        <Form
            action='/api/admins/update'
            template='UPDATE'
            multipart
        >
            <input name='adminId' value={admin.id} className='hidden'/>
            <input name='photoRef' value={admin.photo} className='hidden'/>
            <div className='flex flex-col gap-6'>
                <div className='grid grid-cols-2 gap-4'>
                    <Input
                        icon='UserIcon'
                        label={label.fullName}
                        name='name'
                        placeholder={label.fullName}
                        initialValue={admin.name}
                    />
                    <Input
                        icon='EnvelopeIcon'
                        label={label.email}
                        placeholder={label.email}
                        type='email'
                        initialValue={admin.user.email}
                        disabled={true}
                    />
                    <Input
                        className='col-span-2'
                        icon='PhotoIcon'
                        label={label.photo}
                        name='photo'
                        placeholder={label.photo}
                        type='file'
                        accept='image'
                        required={false}
                    />
                </div>
            </div>
        </Form>
    )
}

export default AdminUpdateForm
