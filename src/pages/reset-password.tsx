import prisma from "@/common/libs/prisma";
import {GetServerSideProps, NextPage} from "next";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {ArrowLeftIcon, EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/outline";
import Link from "@/common/components/atomic/Link";
import Form from "@/common/components/global/Form";
import {FormValidator} from "@/common/hooks/UseForm";
import {checkPasswordStrength, validate} from "@/common/utils/validation";
import {object, string} from "zod";

interface Props {
    email: string
    token: string
}


const ForgotPassword: NextPage<Props> = ({email, token}) => {
    const {action, label} = useStaticValues()
    return (
        <main
            className="flex justify-center items-center gap-10 min-h-screen min-w-full bg-cover text-primary"
            style={{backgroundImage: "url('/img/login/building.webp')"}}
        >
            <div
                className="flex flex-col gap-14 mx-6 w-full md:w-[65%] lg:w-[52.5%] xl:w-[40%] backdrop-blur-sm bg-white/30 px-12 py-14 rounded-2xl shadow-xl"
            >
                <Link
                    className='fixed top-8 left-8 p-2 rounded-full bg-primary/10 hover:bg-primary/20'
                    href='/login'
                    internal
                >
                    <ArrowLeftIcon className='w-6 h-6 text-primary'/>
                </Link>
                <div className='flex justify-center max-h-[4.5rem]'>
                    <img src="/img/logo-blue-1.svg" alt="Logo Tandeem"/>
                </div>
                <Form
                    action='/api/security/reset-password'
                    template={{icon: 'ArrowPathIcon', text: action.update}}
                    validator={validateResetPasswordForm}
                >
                    <input name='token' type="text" className='hidden' value={token}/>
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="flex items-center gap-2">
                                <EnvelopeIcon className="w-5 h-5"/>
                                {label.email}
                            </label>
                            <input
                                id='email'
                                type="email"
                                className="w-full px-3 py-3.5 rounded-lg ring-2 ring-gray-400 text-gray-400 bg-gray-100"
                                placeholder="xyz@tandeem.ma"
                                disabled
                                value={email}
                            />
                            <label htmlFor="password" className="flex items-center gap-2">
                                <LockClosedIcon className="w-5 h-5"/>
                                {label.newPassword}
                            </label>
                            <input
                                id='password'
                                type="password"
                                name="password"
                                className="bg-white text-black w-full px-3 py-3.5 rounded-lg ring-2 ring-primary focus:outline-none focus:ring-secondary transition duration-200 ease-in-out"
                                placeholder="********"
                                required
                            />
                            <label htmlFor="confirmPassword" className="flex items-center gap-2">
                                <LockClosedIcon className="w-5 h-5"/>
                                {label.retypeNewPassword}
                            </label>
                            <input
                                id='confirmPassword'
                                type="password"
                                name="confirmPassword"
                                className="bg-white text-black w-full px-3 py-3.5 rounded-lg ring-2 ring-primary focus:outline-none focus:ring-secondary transition duration-200 ease-in-out"
                                placeholder="********"
                                required
                            />
                        </div>
                    </div>
                </Form>
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const {token} = query
    if (token) {
        const user = await prisma
            .user
            .findUnique({where: {resetToken: token as string}})
        if (user) {
            return user.resetTokenExpiresAt! < new Date()
                ? {redirect: {destination: '/login?_notif=resetTokenExpired', permanent: true}}
                : {props: {email: user.email, token}}
        }
    }
    return {
        redirect: {
            destination: '/login?_notif=resetTokenInvalid',
            permanent: true
        }
    }

}

const validateResetPasswordForm: FormValidator = async (formData) => {
    const messages = await validate(
        formData,
        object({
            token: string()
                .min(1),
            password: string().refine(checkPasswordStrength, 'passwordNotStrong'),
            confirmPassword: string()
        }).refine(
            ({password, confirmPassword}) => password === confirmPassword,
            'confirmPasswordNotMatch'
        )
    );
    return messages.length ? messages[0] : null
};

export default ForgotPassword;
