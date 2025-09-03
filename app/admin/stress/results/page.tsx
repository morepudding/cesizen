"use client";

import { useEffect, useState } from "react";

interface StressResultConfig {
  id: number;
  scoreMin: number;
  scoreMax: number;
  message: string;
}

export default function AdminStressResults() {
  const [results, setResults] = useState<StressResultConfig[]>([]);
  const [newResult, setNewResult] = useState({ scoreMin: 0, scoreMax: 0, message: "" });

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    const res = await fetch("/api/admin/stress/results");
    const data = await res.json();
    setResults(data);
  };

  const handleAddResult = async () => {
    await fetch("/api/admin/stress/results", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newResult),
    });

    setNewResult({ scoreMin: 0, scoreMax: 0, message: "" });
    fetchResults();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">📊 Configuration des Résultats</h1>

      {/* Affichage des résultats existants */}
      {results.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Configurations existantes</h2>
          {results.map((result) => (
            <div key={result.id} className="border p-2 mb-2 rounded">
              <p>Score: {result.scoreMin}-{result.scoreMax}</p>
              <p>{result.message}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-lg font-semibold">Ajouter une configuration</h2>
        <input
          type="number"
          placeholder="Score Min"
          value={newResult.scoreMin}
          onChange={(e) => setNewResult({ ...newResult, scoreMin: parseInt(e.target.value) })}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          placeholder="Score Max"
          value={newResult.scoreMax}
          onChange={(e) => setNewResult({ ...newResult, scoreMax: parseInt(e.target.value) })}
          className="border p-2 rounded w-full mb-2"
        />
        <textarea
          placeholder="Message affiché"
          value={newResult.message}
          onChange={(e) => setNewResult({ ...newResult, message: e.target.value })}
          className="border p-2 rounded w-full mb-2"
        />
        <button onClick={handleAddResult} className="bg-blue-500 text-white px-4 py-2 rounded">
          Ajouter
        </button>
      </div>
    </div>
  );
}
