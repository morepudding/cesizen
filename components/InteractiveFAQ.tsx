"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import faqAnimation from "../assets/faqAnimation.json"; // ajuste le chemin si nécessaire

export default function InteractiveFAQ() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-24 h-24 bg-yellow-50 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: showInfo ? 1 : 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowInfo((prev) => !prev)}
      >
        <Lottie
          animationData={faqAnimation}
          autoPlay={showInfo}
          loop={showInfo}
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>
      {showInfo && (
        <motion.div
          className="mt-4 bg-white text-yellow-600 p-3 rounded shadow-md max-w-xs text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm">
            Vous avez des questions ? Consultez notre FAQ pour obtenir des réponses claires et rapides.
          </p>
        </motion.div>
      )}
    </div>
  );
}
