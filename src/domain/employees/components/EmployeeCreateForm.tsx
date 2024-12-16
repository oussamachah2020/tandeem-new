import {FC} from "react";
import {Input} from "@/common/components/atomic/Input";
import {Department} from "@prisma/client";
import {EitherInput} from "@/common/components/atomic/EitherInput";
import Form from "@/common/components/global/Form";
import {useStaticValues} from "@/common/context/StaticValuesContext";

interface Props {
    departments: Department[]
}

export const EmployeeCreateForm: FC<Props> = ({departments}) => {
    const {jobLevel} = useStaticValues()
    return (
        <Form
            action='/api/employees/create'
            template='CREATE'
            multipart
            className='flex flex-col gap-3'
        >
            <h3 className='font-medium text-xl'>Informations</h3>
            <div className='w-full'>
                <div className='grid grid-cols-3 gap-4'>
                    <Input
                        icon='IdentificationIcon'
                        name='firstName'
                        label='Prénom'
                        placeholder="Prénom"
                    />
                    <Input
                        icon='IdentificationIcon'
                        name='lastName'
                        label='Nom'
                        placeholder="Nom"
                    />
                    <Input
                        icon='EnvelopeIcon'
                        name='email'
                        label="Email"
                        placeholder="Email"
                        type='email'
                    />
                    <Input
                        icon='PhoneIcon'
                        name='phone'
                        label='Tel'
                        placeholder="Tel"
                        type='tel'
                    />
                    <Input
                        icon='TagIcon'
                        name='registration'
                        label='Immatricule'
                        placeholder="Immatricule"
                    />
                    <Input
                        icon='PhotoIcon'
                        name='photo'
                        label="Photo"
                        placeholder="Uploader une photo"
                        type='file'
                        accept='image'
                    />
                    <Input
                        icon='BriefcaseIcon'
                        name='level'
                        label='Poste'
                        placeholder="Selectionner le poste"
                        type='select'
                        className='col-span-3'
                        options={jobLevel}
                    />
                    <EitherInput
                        className='col-span-3'
                        initialActiveSide={departments.length > 0 ? 'left' : "right"}
                        unselectableSide={departments.length === 0 ? 'left' : undefined}
                        labels={['Département existant', 'Nouveau département']}
                        nodes={[
                            <Input
                                key={0}
                                icon='BuildingOfficeIcon'
                                name='departmentId'
                                placeholder="Choisir un departement"
                                type='select'
                                options={departments.reduce((acc, {id, title}) => ({...acc, [id]: title}), {})}
                            />,
                            <Input
                                key={1}
                                name='departmentName'
                                placeholder="Departement"
                                icon='BuildingOfficeIcon'
                            />
                        ]}
                    />
                </div>
            </div>
        </Form>
    );
}
