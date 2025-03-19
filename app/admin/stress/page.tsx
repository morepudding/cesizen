"use client";

import { useEffect, useState } from "react";

interface StressQuestion {
  id: number;
  event: string;
  points: number;
}

export default function AdminStressPage() {
  const [questions, setQuestions] = useState<StressQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState({ event: "", points: 0 });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const res = await fetch("/api/admin/stress");
    const data = await res.json();
    setQuestions(data);
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.event || newQuestion.points <= 0) {
      alert("Veuillez remplir tous les champs correctement.");
      return;
    }

    await fetch("/api/admin/stress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    });

    setNewQuestion({ event: "", points: 0 });
    fetchQuestions();
  };

  const handleDeleteQuestion = async (id: number) => {
    await fetch("/api/admin/stress", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    fetchQuestions();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">🧠 Gestion du Diagnostic de Stress</h1>

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Ajouter une Question</h2>
        <input
          type="text"
          placeholder="Nouvelle question"
          value={newQuestion.event}
          onChange={(e) => setNewQuestion({ ...newQuestion, event: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Points"
          value={newQuestion.points}
          onChange={(e) => setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={handleAddQuestion} className="bg-blue-500 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Questions existantes</h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">ID</th>
              <th className="border p-2">Question</th>
              <th className="border p-2">Points</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((question) => (
              <tr key={question.id} className="text-center">
                <td className="border p-2">{question.id}</td>
                <td className="border p-2">{question.event}</td>
                <td className="border p-2">{question.points}</td>
                <td className="border p-2">
                  <button
                    onClick={() => handleDeleteQuestion(question.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    ❌ Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
