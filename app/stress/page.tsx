"use client";

import { useEffect, useState } from "react";

export default function StressTest() {
  const [questions, setQuestions] = useState<{ id: number; event: string; points: number }[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);

  // Récupérer les questions via l'API
  useEffect(() => {
    fetch("/api/stress/questions")
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(error => console.error("❌ Erreur lors de la récupération des questions :", error));
  }, []);

  const handleSubmit = async () => {
    if (selectedEvents.length === 0) {
      alert("Veuillez sélectionner au moins un événement.");
      return;
    }

    const response = await fetch("/api/stress/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedEvents }),
    });

    const result = await response.json();
    if (result.totalScore !== undefined) {
      setScore(result.totalScore);
    } else {
      alert("Erreur lors du calcul du score.");
    }
  };

  // Déterminer le niveau de stress
  const getStressLevel = (score: number) => {
    if (score < 150) return { level: "🟢 Stress Faible", color: "text-green-500" };
    if (score < 300) return { level: "🟡 Stress Modéré", color: "text-yellow-500" };
    return { level: "🔴 Stress Élevé", color: "text-red-500" };
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">🧠 Test de Stress</h1>

      {score !== null ? (
        <div className="mt-6 p-4 border rounded-lg shadow-lg bg-gray-100">
          <p className="text-lg font-semibold">Votre score de stress est : {score}</p>
          <p className={`text-xl font-bold ${getStressLevel(score).color}`}>
            {getStressLevel(score).level}
          </p>
          <button
            onClick={() => setScore(null)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Recommencer le test
          </button>
        </div>
      ) : (
        <div>
          <p className="mb-4">Cochez les événements que vous avez vécus :</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map(q => (
              <label key={q.id} className="flex items-center space-x-2 bg-gray-100 p-3 rounded shadow">
                <input
                  type="checkbox"
                  value={q.id}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    setSelectedEvents(prev =>
                      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                    );
                  }}
                  className="h-5 w-5"
                />
                <span>{q.event} ({q.points} points)</span>
              </label>
            ))}
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Valider mon test
          </button>
        </div>
      )}
    </div>
  );
}
