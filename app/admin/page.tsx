"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Chargement...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">⚙️ Espace Administrateur</h1>
      <p className="mt-4 text-gray-600">Bienvenue dans la section d'administration de CESIZen.</p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/users" className="p-6 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100 transition">
          <h2 className="text-xl font-semibold">👤 Gestion des Utilisateurs</h2>
          <p>Voir, modifier et supprimer les utilisateurs.</p>
        </Link>

        <Link href="/admin/activities" className="p-6 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100 transition">
          <h2 className="text-xl font-semibold">🎭 Gestion des Activités</h2>
          <p>Ajouter, modifier et désactiver des activités de détente.</p>
        </Link>

        <Link href="/admin/stress" className="p-6 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100 transition">
          <h2 className="text-xl font-semibold">🧠 Gestion du Diagnostic de Stress</h2>
          <p>Configurer les questions et la page de résultat.</p>
        </Link>

        <Link href="/admin/emotions" className="p-6 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100 transition">
          <h2 className="text-xl font-semibold">📊 Gestion des Émotions</h2>
          <p>Configurer la liste des émotions disponibles.</p>
        </Link>

        {/* 🔹 Ajout du bouton "Gestion des Contenus" */}
        <Link href="/admin/content" className="p-6 bg-white text-blue-600 rounded-lg shadow hover:bg-blue-100 transition">
          <h2 className="text-xl font-semibold">📝 Gestion des Contenus</h2>
          <p>Modifier le contenu des pages du site.</p>
        </Link>
      </div>
    </div>
  );
}
