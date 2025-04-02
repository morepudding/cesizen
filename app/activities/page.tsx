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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-green-800 mb-8 text-center">🧘 Activités de Détente</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Rechercher une activité..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 border border-green-200 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
            />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-green-200 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:border-transparent"
            >
              <option value="">Toutes les catégories</option>
              <option value="Bien-être">Bien-être</option>
              <option value="Sport">Sport</option>
              <option value="Loisir">Loisir</option>
              <option value="Aventure">Aventure</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Liste des activités */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 flex flex-col"
                >
                  <div className="p-6 flex flex-col h-full">
                    <div className="flex-none">
                      <h2 className="text-xl font-semibold text-green-800 mb-3">
                        <Link href={`/activities/${activity.id}`} className="hover:text-green-600 transition">
                          {activity.title}
                        </Link>
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-2 h-12">{activity.description}</p>
                    </div>
                    <div className="flex-none">
                      <div className="flex items-center gap-2 mb-4">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                          {activity.category}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">⏳</span> {activity.duration}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">🎯</span> {activity.level}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600">📍</span> {activity.location}
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow flex items-end">
                      {session && (
                        <button
                          onClick={() => handleAddFavorite(activity.id)}
                          className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition flex items-center justify-center gap-2 h-10"
                        >
                          <div className="w-6 h-6 flex items-center justify-center">
                            <span className="text-base">⭐</span>
                          </div>
                          <span>Ajouter aux favoris</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Liste des favoris */}
          {session && (
            <div className="lg:col-span-1">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <span>💛</span> Mes Favoris
                </h2>
                {favorites.length > 0 ? (
                  <div className="space-y-3">
                    {favorites.map((fav) => (
                      <div 
                        key={fav.id} 
                        className="bg-green-50 rounded-lg p-3 flex items-center justify-between group"
                      >
                        {fav.activity ? (
                          <span className="text-green-800 font-medium truncate">{fav.activity.title}</span>
                        ) : (
                          <span className="text-red-500">⚠️ Activité introuvable</span>
                        )}
                        <button
                          onClick={() => handleRemoveFavorite(fav.activity?.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-600"
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">Vous n'avez pas encore de favoris.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  