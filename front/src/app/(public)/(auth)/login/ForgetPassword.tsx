import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";

export const ForgetPassword = ({
  setShowForgetPassword,
}: {
  setShowForgetPassword: Dispatch<SetStateAction<boolean>>;
}) => {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const retrieve = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/retrieve-password`,
      {
        method: "POST",
        body: JSON.stringify({ to: email }),
        headers: { "Content-Type": "application/json" },
      }
    );
    const data = await response.json();
    return data;
  };

  const retrievePassword = async () => {
    await toast.promise(
      retrieve(),
      {
        loading: "Loading",
        success: (data) => `${data.message}`,
        error: (err) => ` ${err.message}`,
      },
      {
        style: {
          minWidth: "350px",
        },
        success: {
          duration: 2000,
        },
      }
    );
    router.push("/login?callbackUrl=/&error=EmailSend");
    setShowForgetPassword(false);
  };

  return (
    <div className="bg-white rounded-md shadow-2xl p-5">
      <h1 className="text-gray-800 font-bold text-2xl mb-1 flex items-center justify-center pb-4">
        Recuperar contraseña
      </h1>
      <h5 className="text-gray-800 font-bold text-sm mb-1 flex items-center justify-center pb-4">
        Ingresa tu correo electrónico y una nueva contraseña se te estará
        enviando.
      </h5>
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
          className=" pl-2 w-full text-black outline-none border-none"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo Electrónico"
        />
      </div>
      <div className="flex">
        <button
          type="button"
          className="block mr-4 w-full bg-red-primary mt-5 py-2 rounded-2xl hover:-translate-y-1 transition-all duration-500 text-white font-semibold mb-2"
          onClick={() => {
            if (email.trim() !== "") {
              retrievePassword();
            }
          }}
        >
          Enviar
        </button>
        <button
          type="button"
          className="block w-full text-red-primary bg-white mt-5 py-2 rounded-2xl hover:-translate-y-1 transition-all duration-500 border border-red-primary font-semibold mb-2"
          onClick={() => {
            setShowForgetPassword(false);
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};
