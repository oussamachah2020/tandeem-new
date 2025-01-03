import prisma from "@/common/libs/prisma";
import {GetServerSideProps, NextPage} from "next";
import {hash} from "bcrypt";
import {useStaticValues} from "@/common/context/StaticValuesContext";
import {ArrowLeftIcon, EnvelopeIcon} from "@heroicons/react/24/outline";
import Link from "@/common/components/atomic/Link";
import { validate } from "@/common/utils/validation";
import { object, string } from "zod";
import { FormValidator } from "@/common/hooks/UseForm";
import { useState } from "react";
import Button from "@/common/components/atomic/Button";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const { action, label } = useStaticValues();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setLoading(true);

    try {
      const response = await fetch("/api/security/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        toast.success(
          "L'e-mail de réinitialisation du mot de passe a été envoyé avec succès"
        );
      } else if (response.status === 404) {
        setError("Aucun utilisateur n'existe avec cet email");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen min-w-full ">
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
            Réinitialiser le mot de passe
          </h2>
          <div className="w-full">
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
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="bg-white text-black w-full px-3 h-12 rounded-lg ring-1 ring-gray-200 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="xyz@tandeem.ma"
                  required
                />
              </div>
              <Button
                type="submit"
                className="py-4 text-lg bg-blue-500"
                icon="ArrowRightOnRectangleIcon"
                text="Demander"
                onClick={submit}
                loading={loading}
                disabled={!email}
              />
              {error && (
                <span className="text-sm mt-2 text-red-500">{error}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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