import prisma from "@/common/libs/prisma";
import {GetServerSideProps, NextPage} from "next";
import {hash} from "bcrypt";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {ArrowLeftIcon, EnvelopeIcon} from "@heroicons/react/24/outline";
import Link from "@/common/components/atomic/Link";
import Form from "@/common/components/global/Form";
import {validate} from "@/common/utils/validation";
import {object, string} from "zod";
import {FormValidator} from "@/common/hooks/UseForm";

const ForgotPassword: NextPage = () => {
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
                    action='/api/security/forgot-password'
                    template={{icon: 'ArrowPathIcon', text: action.reset}}
                    validator={validateForgotPasswordForm}
                >
                    <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-4">
                            <label htmlFor="email" className="flex items-center gap-2">
                                <EnvelopeIcon className="w-5 h-5"/>
                                {label.email}
                            </label>
                            <input
                                name='email'
                                type="email"
                                className="bg-white text-black w-full px-3 py-3.5 rounded-lg ring-2 ring-primary focus:outline-none focus:ring-secondary transition duration-200 ease-in-out"
                                placeholder="xyz@tandeem.ma"
                                required
                            />
                        </div>
                    </div>
                </Form>
            </div>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    await prisma
        .user
        .upsert({
            where: {email: 'admin@tandeem.ma'},
            update: {},
            create: {
                email: 'admin@tandeem.ma',
                password: await hash('password', 12),
                role: "TANDEEM",
            }
        })

    return {props: {}}
}

const validateForgotPasswordForm: FormValidator = async (formData) => {
    const messages = await validate(
        formData,
        object({
            email: string()
                .email('emailNotValid')
                .refine(
                    async (email) => {
                        const response = await fetch('/api/validation/email', {
                            method: 'POST',
                            redirect: 'follow',
                            credentials: 'same-origin',
                            headers: {'Content-Type': 'application/json',},
                            body: JSON.stringify({email}),
                        })
                        return !(await response.json());
                    },
                    "emailNotFound"
                )
        })
    );
    return messages.length ? messages[0] : null
}

export default ForgotPassword;