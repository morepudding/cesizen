"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    const res = await fetch("/api/auth/password/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);

    if (res.ok) {
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">🔑 Nouveau Mot de Passe</h1>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          required
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
          Enregistrer
        </button>
      </form>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
