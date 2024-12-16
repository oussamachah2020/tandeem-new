import {FC, useCallback, useMemo, useState} from "react";
import {Main} from "@/common/components/global/Main";
import {SectionName} from "@/common/security/Sections";
import {GetServerSideProps, GetServerSidePropsResult} from "next";
import {getToken} from "next-auth/jwt";
import {AuthenticatedUser} from "@/common/services/AuthService";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {Input} from "@/common/components/atomic/Input";
import Form from "@/common/components/global/Form";
import {getDownloadUrl, getRoleLevel} from "@/common/utils/functions";
import Button from "@/common/components/atomic/Button";
import {FormValidator} from "@/common/hooks/UseForm";
import {checkPasswordStrength, validate} from "@/common/utils/validation";
import {object, string} from "zod";
import { Role } from "@prisma/client";

interface Props {
    user: AuthenticatedUser
}

const validatePasswordUpdateForm: FormValidator = async (formData) => {
    const messages = await validate(
        formData,
        object({
            oldPassword: string(),
            newPassword: string().refine(checkPasswordStrength, 'passwordNotStrong'),
            confirmPassword: string()
        }).refine(
            ({newPassword, confirmPassword}) => newPassword === confirmPassword,
            'confirmPasswordNotMatch'
        )
    );
    return messages.length ? messages[0] : null
}

const Profile: FC<Props> = ({user}) => {
    const {label, action, role} = useStaticValues()
    const [loading, setLoading] = useState(false);
    const imageUrl = useMemo(() => {
        return user.image
            ? getDownloadUrl(user.image)
            : '/img/logo-blue-1.svg';
    }, [user.role, user.image])

    const validator = useCallback(async (formData: FormData) => {
        setLoading(true)
        const messages = await validatePasswordUpdateForm(formData)
        if (messages) setLoading(false)
        return messages
    }, [])

    return (
        <Main section={SectionName.Profile} user={user}>
            <div className='flex gap-10 bg-white rounded-lg p-6 border box-border'>
                <div>
                    <img
                        className='w-24 aspect-square object-cover rounded-xl'
                        src={imageUrl}
                        alt="Profile photo"
                    />
                </div>
                <div className='flex-1 flex flex-col gap-8'>
                    <div className='flex flex-col gap-4'>
                        <div className='text-primary text-xl font-medium'>{label.information}</div>
                        <div className='flex flex-col gap-1.5'>
                            <div className='grid grid-cols-3 gap-4'>
                                {user.role !== Role.TANDEEM &&
									<Input
										label={label.name}
										icon='UserIcon'
										disabled={true}
										initialValue={user.name}
									/>
                                }
                                <Input
                                    label={label.email}
                                    icon='EnvelopeIcon'
                                    disabled={true}
                                    initialValue={user.email}
                                />
                                <Input
                                    label={label.role}
                                    icon='CubeIcon'
                                    disabled={true}
                                    initialValue={role[user.role]}
                                />
                            </div>
                        </div>
                    </div>
                    {getRoleLevel(user.role) === 2 &&
                        <div className='flex flex-col gap-4'>
                            <div className='text-primary text-xl font-medium'>{label.conditions}</div>
                            <div className='flex flex-col gap-1.5'>
                                <div className='grid grid-cols-4 gap-4'>
                                    <Input
                                        label={label.maxNumberOfEmployees}
                                        icon='UsersIcon'
                                        disabled={true}
                                        initialValue={user.customer?.maxEmployees}
                                    />
                                </div>
                            </div>
                        </div>}
                    <hr className='border-0 border-b'/>
                    <div className='flex flex-col gap-3'>
                        <div className='text-primary text-xl font-medium'>{label.password}</div>
                        <Form
                            action='/api/security/update-password'
                            className='flex items-end gap-5'
                            validator={validator}
                        >
                            <Input
                                className='flex-1'
                                label={label.oldPassword}
                                icon='LockOpenIcon'
                                type='password'
                                name='oldPassword'
                                placeholder='********'
                            />
                            <Input
                                className='flex-1'
                                label={label.newPassword}
                                icon='LockClosedIcon'
                                type='password'
                                name='newPassword'
                                placeholder='*******'
                            />
                            <Input
                                className='flex-1'
                                label={label.retypeNewPassword}
                                icon='LockClosedIcon'
                                type='password'
                                name='confirmPassword'
                                placeholder='*******'
                            />
                            <Button
                                icon='ArrowPathIcon'
                                className='text-sm h-11'
                                text={action.confirm}
                                loading={loading}
                            />
                        </Form>
                    </div>
                </div>
            </div>
        </Main>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const user = (await getToken(context)) as unknown as AuthenticatedUser
    const result: GetServerSidePropsResult<Props> = {
        props: {
            user: JSON.parse(JSON.stringify(user))
        }
    }
    return result
}

export default Profile