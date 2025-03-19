"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  location: string;
  equipment: string | null;
}

interface Favorite {
  id: number;
  activity: Activity | null;
}

export default function ActivitiesPage() {
  const { data: session } = useSession();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");

  useEffect(() => {
    fetchActivities();
    if (session) fetchFavorites();
  }, [session]);

  const fetchActivities = async () => {
    try {
      const response = await fetch("/api/activities");
      if (!response.ok) throw new Error("Erreur lors de la récupération des activités.");
      const data = await response.json();
      setActivities(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger les activités.");
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await fetch("/api/activities/favorites");
      if (!response.ok) throw new Error("Erreur lors de la récupération des favoris.");
      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger vos favoris.");
    }
  };

  const handleAddFavorite = async (activityId: number) => {
    try {
      const response = await fetch("/api/activities/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // ✅ Gérer le cas où la réponse est vide
        throw new Error(errorData.error || "Erreur lors de l'ajout aux favoris.");
      }
  
      const newFavorite = await response.json();
      if (!newFavorite || !newFavorite.id) throw new Error("Réponse inattendue de l'API.");
  
      setFavorites((prev) => [...prev, newFavorite]);
    } catch (err) {
      console.error(err);
      setError("Impossible d'ajouter cette activité aux favoris.");
    }
  };
  

  const handleRemoveFavorite = async (activityId: number | undefined) => {
    if (!activityId) return;

    try {
      const response = await fetch("/api/activities/favorites", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activityId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la suppression du favori.");
      }

      setFavorites((prev) => prev.filter((fav) => fav.activity?.id !== activityId));
    } catch (err) {
      console.error(err);
      setError("Impossible de retirer cette activité des favoris.");
    }
  };

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? activity.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col md:flex-row p-10 space-y-10 md:space-y-0 md:space-x-10">
      {/* Liste des activités */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">🧘 Activités de Détente</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Filtres */}
        <div className="mb-6 flex space-x-4">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Toutes les catégories</option>
            <option value="Bien-être">Bien-être</option>
            <option value="Sport">Sport</option>
            <option value="Loisir">Loisir</option>
            <option value="Aventure">Aventure</option>
          </select>
        </div>

        {/* Liste des activités */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div key={activity.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-lg font-semibold">
                <Link href={`/activities/${activity.id}`}>
                  <span className="text-blue-600 hover:underline cursor-pointer">
                    {activity.title}
                  </span>
                </Link>
              </h2>
              <p className="text-gray-600">{activity.description}</p>
              <span className="text-sm text-blue-500">{activity.category}</span>
              <p className="text-sm text-gray-500">
                ⏳ {activity.duration} | 🎯 {activity.level} | 📍 {activity.location}
              </p>
              {session && (
                <button
                  onClick={() => handleAddFavorite(activity.id)}
                  className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  ⭐ Ajouter aux favoris
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Liste des favoris */}
      {session && (
        <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">💛 Vos favoris</h2>
          {favorites.length > 0 ? (
            <ul>
              {favorites.map((fav) => (
                <li key={fav.id} className="p-2 border-b flex justify-between items-center">
                  {fav.activity ? (
                    <span>{fav.activity.title}</span>
                  ) : (
                    <span className="text-red-500">⚠️ Activité introuvable</span>
                  )}
                  <button
                    onClick={() => handleRemoveFavorite(fav.activity?.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    ❌ Retirer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>Vous n'avez pas encore de favoris.</p>
          )}
        </div>
      )}
    </div>
  );
}
  