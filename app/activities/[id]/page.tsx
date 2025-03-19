"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivity();
  }, [id]);

  const fetchActivity = async () => {
    try {
      const response = await fetch(`/api/activities/${id}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération de l'activité.");
      const data = await response.json();
      setActivity(data);
    } catch (err) {
      console.error(err);
      setError("Impossible de charger cette activité.");
    }
  };

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!activity) {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
      <p className="text-gray-600 text-lg mb-4">{activity.description}</p>

      <div className="mb-4">
        <p className="text-sm mb-2">Catégorie : <span className="text-blue-500">{activity.category}</span></p>
        <p className="text-sm mb-2">Durée : <span className="text-blue-500">{activity.duration}</span></p>
        <p className="text-sm mb-2">Niveau requis : <span className="text-blue-500">{activity.level}</span></p>
        <p className="text-sm mb-2">Lieu : <span className="text-blue-500">{activity.location}</span></p>
        {activity.equipment && (
          <p className="text-sm mb-2">Matériel requis : <span className="text-blue-500">{activity.equipment}</span></p>
        )}
      </div>
    </div>
  );
}
