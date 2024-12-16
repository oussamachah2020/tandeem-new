"use client";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Button from "@/common/components/atomic/Button";
import Link from "@/common/components/atomic/Link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/zustand/auth-store";
import { AuthResponse, User } from "../../types/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import FbIcon from "@/../public/icons/fb-icon.svg";
import InstaIcon from "@/../public/icons/insta-icon.svg";
import LinkedInIcon from "@/../public/icons/linkedIn-icon.svg";
import WhatsAppIcon from "@/../public/icons/whatsapp-icon.svg";
import { FacebookIcon, InstagramIcon, LinkedinIcon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Entrez une adresse e-mail valide" }),
  password: z.string().min(8),
});

export default function Home() {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { accessToken, authenticatedUser, setTokens, setAuthenticatedUser } =
    useAuthStore();
  const router = useRouter();

  async function getUserDetails(token: string) {
    const response = await fetch("/api/auth/user-details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setAuthenticatedUser(data);
    }
  }

  async function submit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "Application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });
      const data: AuthResponse = await response.json();

      getUserDetails(data.accessToken);
      setTokens(data.accessToken, data.refreshToken);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const redirection = setInterval(() => {
      if (accessToken && authenticatedUser) {
        router.replace("/dashboard");
      }
    }, 1000);

    return () => clearInterval(redirection);
  }, [accessToken, authenticatedUser]);

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
            Se Connecter
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
                  {...register("email")}
                  className="bg-white text-black w-full px-3 h-12 rounded-lg ring-1 ring-gray-200 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="xyz@tandeem.ma"
                  required
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
                  {...register("password")}
                  className="bg-white text-black w-full px-3 h-12 rounded-lg ring-1 ring-gray-200 focus:outline-none focus:ring-blue-500 transition duration-200 ease-in-out"
                  placeholder="***********"
                  required
                />
                {errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Link
                href="/forgot-password"
                internal
                className="text-blue-500 no-underline hover:text-blue-700 text-sm"
              >
                Mot de passe oublié?
              </Link>

              <Button
                type="submit"
                className="py-4 text-lg bg-blue-500"
                icon="ArrowRightOnRectangleIcon"
                text="Connexion"
                loading={loading}
                disabled={!isValid}
              />
            </div>
            <div className="flex justify-center mt-10 flex-row items-center gap-2">
              <Link
                href="#"
                className="bg-blue-50 rounded-full hover:text-white hover:bg-secondary transition-colors duration-150 ease-in-out h-8 w-8 flex justify-center items-center"
              >
                <FacebookIcon className="h-5 w-5 text-current " />
              </Link>

              <Link
                href="#"
                className="bg-blue-50 hover:text-white rounded-full hover:bg-secondary transition-colors duration-150 ease-in-out h-8 w-8 flex justify-center items-center"
              >
                <InstagramIcon className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="bg-blue-50 rounded-full hover:text-white hover:bg-secondary transition-colors duration-150 ease-in-out h-8 w-8 flex justify-center items-center"
              >
                <LinkedinIcon className="h-5 w-5" />
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
