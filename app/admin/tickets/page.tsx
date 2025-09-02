"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🎫 Gestion des Tickets</h1>
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Retour
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Fonctionnalité en développement
          </h2>
          <p className="text-gray-500 mb-6">
            La gestion des tickets est en cours de développement. Cette fonctionnalité sera bientôt disponible pour permettre aux administrateurs de :
          </p>
          <ul className="text-left text-gray-600 max-w-md mx-auto space-y-2">
            <li>• Visualiser tous les tickets utilisateurs</li>
            <li>• Modifier le statut des tickets</li>
            <li>• Répondre aux demandes de support</li>
            <li>• Catégoriser les tickets par type et priorité</li>
          </ul>
          <div className="mt-8">
            <a
              href="/support"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Voir la page Support utilisateur
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}