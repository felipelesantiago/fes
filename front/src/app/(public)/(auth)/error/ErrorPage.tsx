"use client";

import { LoginForm } from "@/app/(public)/(auth)/login/LoginForm";
import { useSearchParams } from "next/navigation";
const ErrorClient: React.FC = () => {
  const searchParams = useSearchParams();
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
    NotExist: "El usuario no existe. Por favor intente con otro email.",
    Disabled:
      "Tu usuario se encuentra desabilitado, por favor contacta un administrador.",
    EmailSignin:
      "Las credenciales son incorrectas. Por favor, inténtelo de nuevo.",
    CredentialsSignin:
      "Credenciales incorrectas. Por favor, inténtelo de nuevo.",
    default: "Error desconocido. Por favor, inténtelo de nuevo.",
  };

  const message =
    errorMessage[error as keyof typeof errorMessage] || errorMessage.default;
  console.log(error, "message");
  return <LoginForm />;
};

export default ErrorClient;
