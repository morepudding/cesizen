"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface Emotion {
  id: number;
  date: string;
  emotionType: { name: string; parent?: { name: string } };
  comment?: string;
}

interface EmotionType {
  id: number;
  name: string;
  level: number;
  parentId: number | null;
}

// Mapping des couleurs pour les émotions
const emotionColors: Record<string, { border: string; bg: string }> = {
  "Joie": { border: "border-yellow-500", bg: "bg-yellow-50" },
  "Tristesse": { border: "border-blue-500", bg: "bg-blue-50" },
  "Colère": { border: "border-red-500", bg: "bg-red-50" },
  "Peur": { border: "border-purple-500", bg: "bg-purple-50" },
  "Surprise": { border: "border-orange-500", bg: "bg-orange-50" },
  "Dégoût": { border: "border-green-500", bg: "bg-green-50" },
  "Confiance": { border: "border-teal-500", bg: "bg-teal-50" },
  "Anticipation": { border: "border-pink-500", bg: "bg-pink-50" },
};

export default function EmotionTracker() {
  const { data: session, status } = useSession();
  const [userEmotions, setUserEmotions] = useState<Emotion[]>([]);
  const [emotionTypes, setEmotionTypes] = useState<EmotionType[]>([]);
  const [selectedEmotion, setSelectedEmotion] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [isAddingEmotion, setIsAddingEmotion] = useState(false);
  const [emotionToDelete, setEmotionToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    setComment("");
    setSelectedEmotion(null);
    setIsAddingEmotion(false);
  };

  const handleDeleteEmotion = async (emotionId: number) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tracker/emotions/${emotionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      setUserEmotions((prev) => prev.filter((emotion) => emotion.id !== emotionId));
      setEmotionToDelete(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Une erreur est survenue lors de la suppression de l'émotion");
    } finally {
      setIsDeleting(false);
    }
  };

  // Grouper les émotions par date
  const groupedEmotions = userEmotions.reduce((acc, emotion) => {
    const date = new Date(emotion.date).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(emotion);
    return acc;
  }, {} as Record<string, Emotion[]>);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📖</div>
          <p className="text-gray-600">Chargement de votre journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Bouton pour ajouter une émotion */}
        <motion.button
          onClick={() => setIsAddingEmotion(true)}
          className="w-full bg-white text-gray-800 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-colors duration-200 shadow-lg mb-8"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          + Ajouter une émotion
        </motion.button>

        {/* Formulaire d'ajout d'émotion */}
        <AnimatePresence>
          {isAddingEmotion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-xl p-6 mb-8 shadow-lg"
            >
              <h2 className="text-xl font-semibold mb-4">Comment vous sentez-vous ?</h2>
              <select
                value={selectedEmotion || ""}
                onChange={(e) => setSelectedEmotion(Number(e.target.value))}
                className="w-full p-3 rounded-lg border border-gray-200 mb-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors"
              >
                <option value="">Sélectionner une émotion</option>
                {emotionTypes.map((emotion) => (
                  <option
                    key={emotion.id}
                    value={emotion.level === 1 ? "" : emotion.id}
                    disabled={emotion.level === 1}
                  >
                    {emotion.level === 1 ? `⭐ ${emotion.name}` : `↳ ${emotion.name}`}
                  </option>
                ))}
              </select>

              <textarea
                placeholder="Pourquoi ressentez-vous cette émotion ? (facultatif)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-200 mb-4 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-colors min-h-[100px]"
              />

              <div className="flex gap-4">
                <button
                  onClick={handleAddEmotion}
                  className="flex-1 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200"
                >
                  Enregistrer
                </button>
                <button
                  onClick={() => {
                    setIsAddingEmotion(false);
                    setSelectedEmotion(null);
                    setComment("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                >
                  Annuler
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste des émotions */}
        <div className="space-y-8">
          {Object.entries(groupedEmotions).map(([date, emotions]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="sticky top-0 bg-white rounded-lg p-4 shadow-lg mb-4 z-10">
                <h3 className="text-xl font-semibold text-gray-800">{date}</h3>
              </div>
              <div className="space-y-4">
                {emotions.map((emotion) => {
                  const colors = emotionColors[emotion.emotionType.parent?.name || emotion.emotionType.name] || { border: "border-gray-500", bg: "bg-gray-50" };
                  return (
                    <motion.div
                      key={emotion.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`relative group hover:shadow-xl transition-shadow duration-200 rounded-xl overflow-hidden ${colors.bg}`}
                    >
                      <div className={`relative p-6 border-4 ${colors.border} rounded-xl`}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-2xl font-semibold text-gray-800">
                              {emotion.emotionType.name}
                              {emotion.emotionType.parent && (
                                <span className="text-gray-500 text-lg ml-2">
                                  ({emotion.emotionType.parent.name})
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-500">
                              {new Date(emotion.date).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                          <button
                            onClick={() => setEmotionToDelete(emotion.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 p-2 rounded-full hover:bg-red-50"
                            disabled={isDeleting}
                          >
                            ✕
                          </button>
                        </div>
                        {emotion.comment && (
                          <div className="text-gray-600 bg-white/50 rounded-lg p-4">
                            {emotion.comment}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal de confirmation de suppression */}
        <AnimatePresence>
          {emotionToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-4">Supprimer cette émotion ?</h3>
                <p className="text-gray-600 mb-6">
                  Cette action est irréversible. Êtes-vous sûr de vouloir supprimer cette entrée ?
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setEmotionToDelete(null)}
                    className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleDeleteEmotion(emotionToDelete)}
                    disabled={isDeleting}
                    className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDeleting ? "Suppression..." : "Supprimer"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
