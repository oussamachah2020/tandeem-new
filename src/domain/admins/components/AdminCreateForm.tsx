import {Input} from "@/common/components/atomic/Input";
import {validateAdminCreateForm} from "@/domain/admins/services/AdminValidationService";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";

const AdminCreateForm = () => {
    const {label} = useStaticValues()
    return (
        <Form
            className='grid grid-cols-3 gap-4'
            action='/api/admins/create'
            validator={validateAdminCreateForm}
            template='CREATE'
            multipart
        >
            <Input
                icon='UserIcon'
                label={label.fullName}
                name='name'
                placeholder={label.fullName}
            />
            <Input
                icon='EnvelopeIcon'
                label={label.email}
                name='email'
                placeholder={label.email}
                type='email'
            />
            <Input
                icon='PhotoIcon'
                label={label.photo}
                name='photo'
                placeholder={label.photo}
                type='file'
                accept='image'
            />
        </Form>
    )
}

export default AdminCreateForm
