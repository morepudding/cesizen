"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const exercises = [
  { 
    id: "748", 
    name: "7-4-8", 
    inhale: 7, 
    hold: 4, 
    exhale: 8,
    description: "Technique de relaxation profonde",
    color: "from-blue-400 to-blue-600"
  },
  { 
    id: "55", 
    name: "5-5", 
    inhale: 5, 
    hold: 0, 
    exhale: 5,
    description: "Respiration équilibrée",
    color: "from-green-400 to-green-600"
  },
  { 
    id: "46", 
    name: "4-6", 
    inhale: 4, 
    hold: 0, 
    exhale: 6,
    description: "Anti-stress naturel",
    color: "from-purple-400 to-purple-600"
  },
];

export default function Respiration() {
  const [selectedExercise, setSelectedExercise] = useState(exercises[0]);
  const [phase, setPhase] = useState("inhale");
  const [timeLeft, setTimeLeft] = useState(selectedExercise.inhale);
  const [isRunning, setIsRunning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    scale = minScale + progress * (maxScale - minScale);
  } else if (phase === "hold") {
    scale = maxScale;
  } else if (phase === "exhale") {
    scale = maxScale - progress * (maxScale - minScale);
  }

  return (
    <div className={`min-h-screen bg-gradient-to-b ${selectedExercise.color} p-8`}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">🌬️ Exercices de Respiration</h1>
          <p className="text-white/90 text-lg mb-6">
            Prenez un moment pour vous détendre et respirez en conscience
          </p>
        </motion.div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8">
          <select
            className="w-full p-3 text-lg rounded-xl bg-white/20 text-white border-2 border-white/30 focus:border-white/50 focus:outline-none transition-colors"
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
              <option key={exercise.id} value={exercise.id} className="bg-white text-gray-800">
                {exercise.name} - {exercise.description}
              </option>
            ))}
          </select>
        </div>

        <motion.div
          className="relative flex flex-col items-center justify-center mb-8"
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          {/* Cercle principal */}
          <motion.div
            className="w-64 h-64 rounded-full bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center text-white shadow-xl"
            animate={{
              scale: scale,
              opacity: isHovered ? 0.9 : 1,
            }}
            transition={{
              scale: { duration: 1, ease: "linear" },
              opacity: { duration: 0.2 },
            }}
          >
            <div className="text-4xl font-bold mb-2">
              {phase === "inhale" ? "Inspirez" : phase === "hold" ? "Retenez" : "Expirez"}
            </div>
            <div className="text-6xl font-bold">{timeLeft}</div>
            <div className="text-sm mt-2">secondes</div>
          </motion.div>

          {/* Indicateurs de phase */}
          <div className="flex gap-4 mt-8">
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              phase === "inhale" ? "bg-white" : "bg-white/30"
            }`} />
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              phase === "hold" ? "bg-white" : "bg-white/30"
            }`} />
            <div className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              phase === "exhale" ? "bg-white" : "bg-white/30"
            }`} />
          </div>
        </motion.div>

        <motion.button
          className="w-full bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-white/30 transition-colors duration-200"
          onClick={() => setIsRunning(!isRunning)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isRunning ? "Pause" : "Commencer"}
        </motion.button>
      </div>
    </div>
  );
}
