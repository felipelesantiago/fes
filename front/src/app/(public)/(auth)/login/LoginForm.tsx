"use client";

import { ForgetPassword } from "@/app/(public)/(auth)/login/ForgetPassword";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const error = searchParams.get("error");

  const errorMessage = {
    Signin: "Error al iniciar sesión. Por favor, inténtelo de nuevo.",
    OAuthSignin:
      "Error al iniciar sesión con OAuth. Por favor, inténtelo de nuevo.",
    OAuthCallback:
      "Error en la devolución de llamada de OAuth. Por favor, inténtelo de nuevo.",
    OAuthCreateAccount:
      "Error al crear la cuenta de OAuth. Por favor, inténtelo de nuevo.",
    EmailCreateAccount:
      "Error al crear la cuenta con el correo electrónico. Por favor, inténtelo de nuevo.",
    Callback:
      "Error en la devolución de llamada. Por favor, inténtelo de nuevo.",
    OAuthAccountNotLinked: "Por favor, use otro método para iniciar sesión.",
    Disabled:
      "Tu usuario se encuentra desabilitado, por favor contacta un administrador.",
    NotExist:
      "El usuario no existe. Por favor intente con otro correo electrónico.",
    EmailSignin:
      "Las credenciales son incorrectas. Por favor, inténtelo de nuevo.",
    CredentialsSignin:
      "Credenciales incorrectas. Por favor, inténtelo de nuevo.",
    EmailSend: "Revise su correo electrónico para obtener su nueva contraseña.",
    default: "Error desconocido. Por favor, inténtelo de nuevo.",
  };
  console.log(error);
  const message =
    error !== null
      ? errorMessage[error as keyof typeof errorMessage] || errorMessage.default
      : null;

  const handleSubmit = () => {
    signIn("credentials", {
      email: email,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });
  };

  return (
    <div className="h-screen flex justify-center">
      <div className="flex w-full lg:w-1/2 justify-center items-center bg-white space-y-8">
        <div className="w-full px-8 md:px-32 lg:px-24">
          {showForgetPassword ? (
            <ForgetPassword setShowForgetPassword={setShowForgetPassword} />
          ) : (
            <form className="bg-white rounded-md shadow-2xl p-5">
              <h1 className="text-gray-800 font-bold text-2xl mb-1 flex items-center justify-center pb-4">
                Bienvenido a Tu Patrimonio SpA
              </h1>
              <div className="flex items-center border-2 mb-8 py-2 px-3 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
                <input
                  id="email"
                  className="text-black pl-2 w-full outline-none border-none"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Correo Electrónico"
                />
              </div>
              <div className="flex items-center border-2 mb-12 py-2 px-3 rounded-2xl ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <input
                  className="pl-2 text-black w-full outline-none border-none"
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  placeholder="Contraseña"
                />
              </div>
              {message && (
                <div>
                  <span className="text-red-primary font-bold">{message}</span>
                </div>
              )}
              <button
                type="button"
                className="block w-full bg-red-primary mt-5 py-2 rounded-2xl hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                onClick={() => handleSubmit()}
              >
                Ingresar
              </button>
              <button
                type="button"
                className="block w-full bg-red-primary mt-5 py-2 rounded-2xl hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
                onClick={() => signIn("google", { callbackUrl: "/" })}
              >
                Ingresar con Google
              </button>
              <div className="flex justify-between mt-4">
                <span
                  className="text-sm text-black ml-2 hover:text-blue-500 cursor-pointer hover:-translate-y-1 duration-500 transition-all"
                  onClick={() => {
                    setShowForgetPassword(true);
                  }}
                >
                  Contraseña Olvidada ?
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
