"use client";

import { useEffect, useState } from "react";

interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  level: string;
  location: string;
  equipment?: string;
  isActive: boolean;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [newActivity, setNewActivity] = useState<Activity>({
    id: 0,
    title: "",
    description: "",
    category: "",
    duration: "",
    level: "",
    location: "",
    equipment: "",
    isActive: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    const response = await fetch("/api/admin/activities");
    const data = await response.json();
    setActivities(data);
  };

  const handleAddOrUpdateActivity = async () => {
    const method = isEditing ? "PUT" : "POST";
    const response = await fetch("/api/admin/activities", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newActivity),
    });

    if (response.ok) {
      fetchActivities();
      resetForm();
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setNewActivity(activity);
    setIsEditing(true);
  };

  const handleDisableActivity = async (id: number) => {
    const response = await fetch("/api/admin/activities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchActivities();
    }
  };

  const handleDeleteActivity = async (id: number) => {
    const response = await fetch("/api/admin/activities", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      fetchActivities();
    }
  };

  const resetForm = () => {
    setNewActivity({
      id: 0,
      title: "",
      description: "",
      category: "",
      duration: "",
      level: "",
      location: "",
      equipment: "",
      isActive: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Gestion des Activités Détente</h1>

      {/* Formulaire de création / modification */}
      <div className="mb-6 space-y-2">
        <input
          type="text"
          placeholder="Titre"
          value={newActivity.title}
          onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Description"
          value={newActivity.description}
          onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Catégorie"
          value={newActivity.category}
          onChange={(e) => setNewActivity({ ...newActivity, category: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Durée (ex: '1 heure')"
          value={newActivity.duration}
          onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Niveau (ex: 'Débutant')"
          value={newActivity.level}
          onChange={(e) => setNewActivity({ ...newActivity, level: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Lieu (ex: 'En ligne', 'Salle de sport')"
          value={newActivity.location}
          onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="Équipement (optionnel)"
          value={newActivity.equipment}
          onChange={(e) => setNewActivity({ ...newActivity, equipment: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAddOrUpdateActivity}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          >
            {isEditing ? "Modifier" : "Ajouter"}
          </button>
          {isEditing && (
            <button
              onClick={resetForm}
              className="bg-gray-500 text-white px-4 py-2 rounded w-full"
            >
              Annuler
            </button>
          )}
        </div>
      </div>

      {/* Liste des activités */}
      <ul className="mt-4">
        {activities.map((activity) => (
          <li key={activity.id} className="border-b flex justify-between items-center p-2">
            <div>
              <span className="font-bold">{activity.title}</span> - {activity.duration} - {activity.level} -{" "}
              <span className={activity.isActive ? "text-green-600" : "text-red-600"}>
                {activity.isActive ? "Active" : "Désactivée"}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEditActivity(activity)}
                className="bg-yellow-500 text-white px-2 py-1 rounded"
              >
                Modifier
              </button>
              {activity.isActive ? (
                <button
                  onClick={() => handleDisableActivity(activity.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Désactiver
                </button>
              ) : (
                <button
                  onClick={() => handleDisableActivity(activity.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Réactiver
                </button>
              )}
              <button
                onClick={() => handleDeleteActivity(activity.id)}
                className="bg-gray-500 text-white px-2 py-1 rounded"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
