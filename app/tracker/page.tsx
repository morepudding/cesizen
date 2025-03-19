"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface Emotion {
  id: number;
  date: string;
  emotionType: { name: string; parent?: { name: string } }; // Ajout du parent
  comment?: string;
}

interface EmotionType {
  id: number;
  name: string;
  level: number;
  parentId: number | null;
}

export default function EmotionTracker() {
  const { data: session, status } = useSession();
  const [userEmotions, setUserEmotions] = useState<Emotion[]>([]);
  const [emotionTypes, setEmotionTypes] = useState<EmotionType[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [comment, setComment] = useState(""); // Nouveau champ pour les commentaires

  useEffect(() => {
    fetchEmotions();
    fetchEmotionTypes();
  }, []);

  const fetchEmotions = async () => {
    const res = await fetch("/api/tracker/emotions");
    const data = await res.json();
    setUserEmotions(data);
  };

  const fetchEmotionTypes = async () => {
    const res = await fetch("/api/emotions/all");
    const data = await res.json();
    setEmotionTypes(data);
  };

  const handleAddEmotion = async () => {
    if (!selectedEmotion) return;

    const response = await fetch("/api/tracker/emotions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emotionId: selectedEmotion, comment }),
    });

    if (!response.ok) return;

    const newEmotion = await response.json();
    setUserEmotions((prev) => [newEmotion, ...prev]);
    setComment(""); // Réinitialise le champ commentaire après ajout
  };

  if (status === "loading") return <p>Chargement...</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">📊 Tracker d’Émotions</h1>

      <div className="mb-4">
        {/* Liste déroulante pour les émotions */}
        <select
          value={selectedEmotion || ""}
          onChange={(e) => setSelectedEmotion(Number(e.target.value))}
          className="border p-2 rounded"
        >
          <option value="">Sélectionner une émotion</option>
          {emotionTypes.map((emotion) => (
            <option
              key={emotion.id}
              value={emotion.level === 1 ? "" : emotion.id} // Désactive les émotions de niveau 1
              disabled={emotion.level === 1} // Désactive les émotions principales
            >
              {emotion.level === 1 ? `⭐ ${emotion.name}` : `↳ ${emotion.name}`}
            </option>
          ))}
        </select>

        {/* Champ pour le commentaire */}
        <textarea
          placeholder="Pourquoi ressentez-vous cette émotion ? (facultatif)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full mt-2"
        />

        <button
          onClick={handleAddEmotion}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded mt-2"
        >
          Ajouter
        </button>
      </div>

      <ul>
        {userEmotions.map((emotion) => (
          <li key={emotion.id} className="border-b p-2">
            {new Date(emotion.date).toLocaleString()} - {emotion.emotionType.name}
            {emotion.emotionType.parent && ` (${emotion.emotionType.parent.name})`} {/* Affiche la catégorie principale */}
            {emotion.comment && (
              <div className="text-sm text-gray-500">Commentaire : {emotion.comment}</div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
