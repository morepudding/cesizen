"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      window.location.href = "/dashboard"; // Redirection après connexion
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Connexion</h1>
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="mb-4">
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        
        <div className="mb-4">
          <label>Mot de passe :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Se connecter
        </button>

        {/* Lien vers la réinitialisation du mot de passe */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => router.push("/auth/reset")}
            className="text-blue-500 hover:underline"
          >
            Mot de passe oublié ?
          </button>
        </div>
      </form>
    </div>
  );
}
