"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

// Ce composant n'affiche son contenu qu'après le montage (côté client uniquement)
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = React.useState(false);
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;
  return <>{children}</>;
}

export default function Dashboard() {
  const { data: session, status } = useSession();

  // Données fictives pour la vitrine du dashboard
  const latestStressScore = 68;
  const avgStressScore = 55;
  const respirationCount = 32;
  const dominantEmotion = "Joie";
  const recentStressTests = [
    { date: "2025-03-15", score: 60 },
    { date: "2025-03-14", score: 72 },
    { date: "2025-03-13", score: 55 },
    { date: "2025-03-12", score: 48 },
    { date: "2025-03-11", score: 62 },
  ];
  const emotionDistribution = [
    { emotion: "Joie", count: 15 },
    { emotion: "Tristesse", count: 7 },
    { emotion: "Colère", count: 5 },
    { emotion: "Peur", count: 3 },
  ];

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* En-tête personnalisé */}
      <header className="mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Tableau de Bord</h1>
        {/* La partie qui dépend de la session est rendue uniquement côté client */}
        <ClientOnly>
          {session && (
            <p
              className="mt-2 text-xl text-gray-600"
              suppressHydrationWarning
            >
              Bonjour, {session.user?.name} ! Bienvenue dans votre espace personnel.
            </p>
          )}
        </ClientOnly>
      </header>

      {/* Section Statistiques Globales */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* Dernier Test de Stress */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Dernier Test de Stress</h2>
          <p className="text-4xl font-bold text-blue-600">{latestStressScore}</p>
          <p className="mt-2 text-gray-500">Score récent</p>
          <Link href="/stress">
            <span className="mt-4 inline-block text-blue-500 hover:underline">
              Voir détails →
            </span>
          </Link>
        </div>
        {/* Moyenne des Tests */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Moyenne des Tests</h2>
          <p className="text-4xl font-bold text-green-600">{avgStressScore}</p>
          <p className="mt-2 text-gray-500">Score moyen</p>
          <Link href="/stress">
            <span className="mt-4 inline-block text-blue-500 hover:underline">
              Voir statistiques →
            </span>
          </Link>
        </div>
        {/* Exercices de Respiration */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Exercices de Respiration</h2>
          <p className="text-4xl font-bold text-purple-600">{respirationCount}</p>
          <p className="mt-2 text-gray-500">Séances effectuées</p>
          <Link href="/respiration">
            <span className="mt-4 inline-block text-blue-500 hover:underline">
              Voir plus →
            </span>
          </Link>
        </div>
      </section>

      {/* Section Graphiques et Historique */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Historique Test de Stress */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Historique Test de Stress</h2>
            <ul>
              {recentStressTests.map((test, index) => (
                <li key={index} className="py-1 border-b last:border-0">
                  <span className="font-medium">{test.date} :</span>{" "}
                  <span className="text-blue-600">{test.score}</span>
                </li>
              ))}
            </ul>
            <Link href="/stress">
              <span className="mt-4 inline-block text-blue-500 hover:underline">
                Voir l'historique complet →
              </span>
            </Link>
          </div>

          {/* Répartition des Émotions */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Répartition des Émotions</h2>
            <ul>
              {emotionDistribution.map((item, index) => (
                <li key={index} className="py-1 border-b last:border-0">
                  <span className="font-medium">{item.emotion} :</span> {item.count} enregistrements
                </li>
              ))}
            </ul>
            <p className="mt-4 text-gray-500">
              Émotion dominante :{" "}
              <span className="font-bold text-green-600">{dominantEmotion}</span>
            </p>
            <Link href="/tracker">
              <span className="mt-4 inline-block text-blue-500 hover:underline">
                Voir plus →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Suggestions / Recommandations */}
      <section className="bg-blue-600 rounded-lg p-6 text-white mb-10">
        <h2 className="text-2xl font-semibold mb-4">Conseils Personnalisés</h2>
        <p>
          D'après vos récentes mesures, nous vous recommandons de faire un exercice de respiration pour réduire votre niveau de stress. N'oubliez pas de prendre des pauses régulières et de noter vos émotions afin de mieux comprendre vos déclencheurs.
        </p>
        <div className="mt-4">
          <Link href="/respiration">
            <span className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition">
              Essayer un exercice
            </span>
          </Link>
        </div>
      </section>

      {/* Section Liens rapides vers les fonctionnalités */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div
          className="p-6 bg-white text-blue-600 rounded-lg shadow-lg cursor-pointer hover:bg-blue-100 transition"
          onClick={() => (window.location.href = "/activities")}
        >
          <h2 className="text-xl font-semibold">Activités de Détente</h2>
          <p>Découvrez des activités relaxantes adaptées à votre besoin.</p>
        </div>
        <div
          className="p-6 bg-white text-blue-600 rounded-lg shadow-lg cursor-pointer hover:bg-blue-100 transition"
          onClick={() => (window.location.href = "/admin")}
        >
          <h2 className="text-xl font-semibold">Espace Admin</h2>
          <p>Gérez vos paramètres et consultez les rapports détaillés.</p>
        </div>
      </section>
    </div>
  );
}
