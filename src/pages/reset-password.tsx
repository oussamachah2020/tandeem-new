import prisma from "@/common/libs/prisma";
import {GetServerSideProps, NextPage} from "next";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {ArrowLeftIcon, EnvelopeIcon, LockClosedIcon} from "@heroicons/react/24/outline";
import Link from "@/common/components/atomic/Link";
import Form from "@/common/components/global/Form";
import {FormValidator} from "@/common/hooks/UseForm";
import {checkPasswordStrength, validate} from "@/common/utils/validation";
import { object, string, z } from "zod";
import { decrypt } from "@/common/utils/encryption";
import Button from "@/common/components/atomic/Button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "next/navigation";

interface Props {
  email: string;
  token: string;
}

const FormSchema = z.object({
  email: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
});

const ForgotPassword = ({}) => {
  const searchParams = useSearchParams();

  const token = searchParams?.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<z.infer<typeof FormSchema>>({ mode: "onChange" });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(values: z.infer<typeof FormSchema>) {
    setLoading(true);

    try {
      if (values.password === values.passwordConfirmation) {
        const response = await fetch("/api/security/reset-password", {
          method: "PUT",
          headers: {
            "Content-Type": "Application/json",
          },
          body: JSON.stringify({
            token: token,
            email: values.email,
            password: values.password,
          }),
        });

        if (response.ok) {
          toast.success("mot de passe mis à jour avec succès");
        } else {
          setError("Email ou mot de passe incorrect");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen min-w-full">
      <div className="hidden lg:flex flex-col pt-0 justify-center items-center w-[70%] bg-gradient-to-r to-blue-500 from-blue-700">
        <img
          src="/img/logo-white.svg"
          alt="Logo Tandeem"
          className="w-52 h-52 -mt-20"
        />
        <img
          src="/img/login-image.svg"
          alt="Logo Tandeem"
          className="w-[60%] h-[60%]"
        />

        <h2 className="w-[70%] text-white text-2xl">
          Transformer votre communication interne et personalisez les avantages
          de vos collaborateurs en quelques clics.
        </h2>
      </div>

      <div className="flex justify-center items-center w-full mx-auto lg:w-[55%] backdrop-blur-sm bg-white px-12 py-14 text-blue-500">
        <div className="flex flex-col gap-10 w-full md:w-[75%] lg:w-[65%]">
          <h2 className="text-2xl text-blue-600 font-semibold text-center">
            Réinitialisation du mot de passe
          </h2>
          <form onSubmit={handleSubmit(submit)} className="w-full">
            <div className="flex flex-col gap-7">
              <div className="flex flex-col gap-4">
                <label
                  htmlFor="email"
                  className="flex items-center text-blue-500 gap-2"
                >
                  <EnvelopeIcon className="w-5 h-5" /> Email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="bg-white text-black w-full px-3 h-12 rounded-lg ring-1 ring-gray-200 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="xyz@tandeem.ma"
                />
                {errors.email && (
                  <p className="text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label
                  htmlFor="password"
                  className="flex text-blue-500 items-center gap-2"
                >
                  <LockClosedIcon className="w-5 h-5" /> Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  className="bg-white text-black w-full px-3 h-12 rounded-lg ring-1 ring-gray-200 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="***********"
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-4">
                <label
                  htmlFor="confirmPassword"
                  className="flex text-blue-500 items-center gap-2"
                >
                  <LockClosedIcon className="w-5 h-5" /> Confirmer le mot de
                  passe
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("passwordConfirmation", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  className="bg-white text-black w-full px-3 h-12 rounded-lg ring-1 ring-gray-200 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="***********"
                />
                {errors.passwordConfirmation && (
                  <p className="text-red-500">
                    {errors.passwordConfirmation.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="py-4 text-lg bg-blue-500"
                icon="PencilIcon"
                text="Modifier"
                loading={loading}
                disabled={!isValid}
              />
            </div>
          </form>
          <a href="/login" className="text-center underline">
            <div className="flex flex-row items-center justify-center gap-2">
              <ArrowLeftIcon className="h-4 w-4 text-primary" />
              <span> Retourner à la page de connexion </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async ({query}) => {
//     const {token} = query
//     if (token) {
//         const user = await prisma
//             .user
//             .findUnique({where: {resetToken: token as string}})
//         if (user) {
//             return user.resetTokenExpiresAt! < new Date()
//                 ? {redirect: {destination: '/login?_notif=resetTokenExpired', permanent: true}}
//                 : {props: {email: user.email, token}}
//         }
//     }
//     return {
//         redirect: {
//             destination: '/login?_notif=resetTokenInvalid',
//             permanent: true
//         }
//     }
// }

// const validateResetPasswordForm: FormValidator = async (formData) => {
//     const messages = await validate(
//         formData,
//         object({
//             token: string()
//                 .min(1),
//             password: string().refine(checkPasswordStrength, 'passwordNotStrong'),
//             confirmPassword: string()
//         }).refine(
//             ({password, confirmPassword}) => password === confirmPassword,
//             'confirmPasswordNotMatch'
//         )
//     );
//     return messages.length ? messages[0] : null
// };

export default ForgotPassword;
