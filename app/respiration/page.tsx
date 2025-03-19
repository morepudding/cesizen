"use client";

import { useState, useEffect } from "react";

const exercises = [
  { id: "748", name: "7-4-8", inhale: 7, hold: 4, exhale: 8 },
  { id: "55", name: "5-5", inhale: 5, hold: 0, exhale: 5 },
  { id: "46", name: "4-6", inhale: 4, hold: 0, exhale: 6 },
];

export default function Respiration() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [phase, setPhase] = useState("inhale");
  const [timeLeft, setTimeLeft] = useState(selectedExercise.inhale);
  const [isRunning, setIsRunning] = useState(false);

  // On définit ici l'échelle minimale et maximale pour l'animation du cercle
  const minScale = 0.8;
  const maxScale = 1.2;

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Changement de phase
        if (phase === "inhale") {
          setPhase(selectedExercise.hold > 0 ? "hold" : "exhale");
          return selectedExercise.hold > 0
            ? selectedExercise.hold
            : selectedExercise.exhale;
        }
        if (phase === "hold") {
          setPhase("exhale");
          return selectedExercise.exhale;
        }
        if (phase === "exhale") {
          setPhase("inhale");
          return selectedExercise.inhale;
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, selectedExercise]);

  // Durée de la phase en cours
  const currentDuration =
    phase === "inhale"
      ? selectedExercise.inhale
      : phase === "hold"
      ? selectedExercise.hold
      : selectedExercise.exhale;

  // Proportion du temps écoulé dans la phase
  const progress = (currentDuration - timeLeft) / currentDuration;

  // Calcul de l'échelle (agrandissement/rétrécissement) du cercle
  let scale = 1;
  if (phase === "inhale") {
    // de minScale à maxScale pendant l'inspiration
    scale = minScale + progress * (maxScale - minScale);
  } else if (phase === "hold") {
    // reste à l'échelle max pendant le hold
    scale = maxScale;
  } else if (phase === "exhale") {
    // repasse progressivement de maxScale à minScale pendant l'expiration
    scale = maxScale - progress * (maxScale - minScale);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-teal-400 to-teal-600 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">🌬️ Exercices de Respiration</h1>
      <p className="text-lg">Sélectionnez un exercice et suivez le guide.</p>

      <select
        className="my-6 p-2 text-black rounded"
        value={selectedExercise.id}
        onChange={(e) => {
          const newExercise = exercises.find((ex) => ex.id === e.target.value);
          if (newExercise) {
            setSelectedExercise(newExercise);
            setTimeLeft(newExercise.inhale);
            setPhase("inhale");
            setIsRunning(false);
          }
        }}
      >
        {exercises.map((exercise) => (
          <option key={exercise.id} value={exercise.id}>
            {exercise.name}
          </option>
        ))}
      </select>

      {/* Cercle unique animé */}
      <div
        className="mt-10 mb-6 w-40 h-40 flex flex-col items-center justify-center rounded-full bg-white text-teal-600 text-2xl font-bold shadow-lg"
        style={{
          transform: `scale(${scale})`,
          transition: "transform 1s linear",
        }}
      >
        {phase === "inhale" ? "Inspirez" : phase === "hold" ? "Retenez" : "Expirez"}
        <br />
        {timeLeft} s
      </div>

      <button
        className="bg-white text-teal-600 px-6 py-2 rounded-lg shadow hover:bg-gray-200 transition"
        onClick={() => setIsRunning(!isRunning)}
      >
        {isRunning ? "Pause" : "Commencer"}
      </button>
    </div>
  );
}
