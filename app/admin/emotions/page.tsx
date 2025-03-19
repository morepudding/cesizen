"use client";

import { useEffect, useState } from "react";

interface EmotionType {
  id: number;
  name: string;
  level: number;
  parentId?: number | null;
  parent?: EmotionType | null;
  children?: EmotionType[];
}

export default function AdminEmotionsPage() {
  const [emotions, setEmotions] = useState<EmotionType[]>([]);
  const [newEmotion, setNewEmotion] = useState({
    name: "",
    level: 1,
    parentId: 0, // on laissera 0 pour "pas de parent"
  });

  // Charger toutes les émotions
  useEffect(() => {
    fetchEmotions();
  }, []);

  const fetchEmotions = async () => {
    try {
      const res = await fetch("/api/admin/emotions");
      const data = await res.json();
      setEmotions(data);
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des émotions :", error);
    }
  };

  // Ajouter une émotion
  const handleAddEmotion = async () => {
    if (!newEmotion.name || !newEmotion.level) {
      alert("Veuillez remplir le nom et le niveau.");
      return;
    }

    // parentId = 0 => pas de parent
    const body = {
      name: newEmotion.name,
      level: newEmotion.level,
      parentId: newEmotion.parentId > 0 ? newEmotion.parentId : null,
    };

    try {
      await fetch("/api/admin/emotions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setNewEmotion({ name: "", level: 1, parentId: 0 });
      await fetchEmotions();
    } catch (error) {
      console.error("❌ Erreur lors de l'ajout de l'émotion :", error);
    }
  };

  // Supprimer une émotion
  const handleDeleteEmotion = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette émotion ?")) return;

    try {
      await fetch("/api/admin/emotions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      await fetchEmotions();
    } catch (error) {
      console.error("❌ Erreur lors de la suppression de l'émotion :", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⚙️ Gestion des Émotions</h1>

      {/* Formulaire d'ajout */}
      <div className="mb-6 bg-gray-100 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Ajouter une nouvelle émotion</h2>
        <div className="mb-2">
          <label className="block font-medium mb-1">Nom de l'émotion :</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={newEmotion.name}
            onChange={(e) => setNewEmotion({ ...newEmotion, name: e.target.value })}
          />
        </div>

        <div className="mb-2">
          <label className="block font-medium mb-1">Niveau :</label>
          <select
            className="border p-2 rounded w-full"
            value={newEmotion.level}
            onChange={(e) => setNewEmotion({ ...newEmotion, level: parseInt(e.target.value, 10) })}
          >
            <option value={1}>Niveau 1 (Émotion Principale)</option>
            <option value={2}>Niveau 2 (Sous-émotion)</option>
          </select>
        </div>

        {/* Choix du parent si niveau 2 */}
        {newEmotion.level === 2 && (
          <div className="mb-2">
            <label className="block font-medium mb-1">Émotion parente (niveau 1) :</label>
            <select
              className="border p-2 rounded w-full"
              value={newEmotion.parentId}
              onChange={(e) => setNewEmotion({ ...newEmotion, parentId: parseInt(e.target.value, 10) })}
            >
              <option value={0}>Aucune</option>
              {emotions
                .filter((emo) => emo.level === 1)  // On ne propose que les émotions niveau 1
                .map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <button
          onClick={handleAddEmotion}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Ajouter
        </button>
      </div>

      {/* Liste des émotions existantes */}
      <h2 className="text-xl font-semibold mb-2">Liste des émotions</h2>
      <table className="border w-full text-left">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Niveau</th>
            <th className="p-2 border">Parent</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {emotions.map((emo) => (
            <tr key={emo.id}>
              <td className="p-2 border">{emo.id}</td>
              <td className="p-2 border">{emo.name}</td>
              <td className="p-2 border">{emo.level}</td>
              <td className="p-2 border">
                {/* On affiche le nom du parent si existant */}
                {emo.parent ? emo.parent.name : "—"}
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDeleteEmotion(emo.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ❌ Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
