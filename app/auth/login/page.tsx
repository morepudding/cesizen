"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const router = useRouter();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
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

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation côté client
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        setName("");
      } else {
        setError(data.message || "Une erreur s'est produite");
      }
    } catch {
      setError("Une erreur s'est produite lors de la création du compte");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md">
        {/* Onglets */}
        <div className="flex mb-6 bg-white rounded-lg shadow-sm">
          <button
            onClick={() => {
              setIsLogin(true);
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-l-lg transition-colors ${
              isLogin
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Connexion
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setError("");
              setSuccess("");
            }}
            className={`flex-1 py-3 px-4 text-center font-medium rounded-r-lg transition-colors ${
              !isLogin
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Créer un compte
          </button>
        </div>

        {/* Formulaire */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {isLogin ? "Se connecter" : "Créer un compte"}
          </h1>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <form onSubmit={isLogin ? handleLoginSubmit : handleRegisterSubmit}>
            {/* Nom (seulement pour l'inscription) */}
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  placeholder="Votre nom complet"
                />
              </div>
            )}

            {/* Email */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="votre@email.com"
              />
            </div>

            {/* Mot de passe */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                placeholder="••••••••"
              />
            </div>

            {/* Confirmation mot de passe (seulement pour l'inscription) */}
            {!isLogin && (
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                  placeholder="••••••••"
                />
              </div>
            )}

            {/* Bouton de soumission */}
            <button
              type="submit"
              className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors ${
                isLogin
                  ? "bg-blue-500 hover:bg-blue-600 focus:ring-blue-500"
                  : "bg-green-500 hover:bg-green-600 focus:ring-green-500"
              } focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {isLogin ? "Se connecter" : "Créer mon compte"}
            </button>
          </form>

          {/* Liens utiles */}
          {isLogin && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => router.push("/auth/password/reset")}
                className="text-blue-500 hover:underline text-sm"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}
        </div>

        {/* Message d'aide */}
        <div className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? (
            <p>
              Pas encore de compte ?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-green-500 hover:underline font-medium"
              >
                Créez-en un gratuitement
              </button>
            </p>
          ) : (
            <p>
              Déjà un compte ?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:underline font-medium"
              >
                Connectez-vous
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
