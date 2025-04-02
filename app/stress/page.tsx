"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Question {
  id: number;
  event: string;
  points: number;
}

export default function StressTest() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<number[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Diviser les questions en 4 étapes
  const questionsPerStep = Math.ceil(questions.length / 4);
  const currentQuestions = questions.slice(
    (currentStep - 1) * questionsPerStep,
    currentStep * questionsPerStep
  );

  useEffect(() => {
    fetch("/api/stress/questions")
      .then(res => res.json())
      .then(data => {
        setQuestions(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("❌ Erreur lors de la récupération des questions :", error);
        setIsLoading(false);
      });
  }, []);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

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

  const getStressLevel = (score: number) => {
    if (score < 150) return { 
      level: "Stress Faible", 
      color: "text-green-500",
      description: "Votre niveau de stress est gérable. Continuez à prendre soin de vous !",
      icon: "🌱"
    };
    if (score < 300) return { 
      level: "Stress Modéré", 
      color: "text-yellow-500",
      description: "Votre niveau de stress est important. Pensez à vous accorder des moments de détente.",
      icon: "🌿"
    };
    return { 
      level: "Stress Élevé", 
      color: "text-red-500",
      description: "Votre niveau de stress est élevé. N'hésitez pas à demander de l'aide et à consulter un professionnel.",
      icon: "🌳"
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <p className="text-gray-600">Chargement des questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-green-800 mb-4">🧠 Test de Stress</h1>
          <p className="text-gray-600 text-lg mb-6">
            Prenez votre temps pour répondre à ces questions. Il n'y a pas de bonnes ou mauvaises réponses.
          </p>
          
          {/* Barre de progression */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500">
            Étape {currentStep} sur 4
          </p>
        </motion.div>

        {score !== null ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="text-6xl mb-4">{getStressLevel(score).icon}</div>
            <p className="text-2xl font-semibold mb-2">Votre score : {score}</p>
            <p className={`text-3xl font-bold ${getStressLevel(score).color} mb-4`}>
              {getStressLevel(score).level}
            </p>
            <p className="text-gray-600 mb-8">{getStressLevel(score).description}</p>
            <button
              onClick={() => {
                setScore(null);
                setSelectedEvents([]);
                setCurrentStep(1);
              }}
              className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors duration-200"
            >
              Recommencer le test
            </button>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {/* Questions */}
            <div className="space-y-4">
              {currentQuestions.map((q, index) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <label className="flex items-center p-4 cursor-pointer">
                    <input
                      type="checkbox"
                      value={q.id}
                      checked={selectedEvents.includes(q.id)}
                      onChange={(e) => {
                        const id = Number(e.target.value);
                        setSelectedEvents(prev =>
                          prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
                        );
                      }}
                      className="w-5 h-5 text-green-500 rounded border-gray-300 focus:ring-green-500"
                    />
                    <div className="ml-4">
                      <span className="text-gray-800 font-medium">{q.event}</span>
                      <span className="text-sm text-gray-500 ml-2">({q.points} points)</span>
                    </div>
                  </label>
                </motion.div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <button
                onClick={handleBack}
                disabled={currentStep === 1}
                className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                  currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-700 hover:bg-green-50"
                }`}
              >
                Précédent
              </button>
              <button
                onClick={handleNext}
                className="bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition-colors duration-200"
              >
                {currentStep === 4 ? "Voir mon résultat" : "Suivant"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
