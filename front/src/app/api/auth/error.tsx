import { LoginForm } from "@/app/(public)/(auth)/login/LoginForm";
import { useRouter } from "next/router";

const ErrorPage: React.FC = () => {
  const router = useRouter();
  const { error } = router.query;

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
    EmailSignin:
      "Error al iniciar sesión con el correo electrónico. Por favor, inténtelo de nuevo.",
    CredentialsSignin:
      "Credenciales incorrectas. Por favor, inténtelo de nuevo.",
    default: "Error desconocido. Por favor, inténtelo de nuevo.",
  };

  const message =
    errorMessage[error as keyof typeof errorMessage] || errorMessage.default;

  return (
    <div>
      <h1>Error de Autenticación</h1>
      <p>{message}</p>
      <LoginForm />
    </div>
  );
};

export default ErrorPage;
