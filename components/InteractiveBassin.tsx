"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import LottieWrapper from "./LottieWrapper";
import bassinAnimation from "../assets/bassinAnimation.json"; // ajuste le chemin si nécessaire

export default function InteractiveBassin() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="relative w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: showInfo ? 1 : 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowInfo((prev) => !prev)}
      >
        <LottieWrapper 
          animationData={bassinAnimation} 
          autoplay={showInfo} 
          loop={showInfo}
          className="w-full h-full"
        />
      </motion.div>
      {showInfo && (
        <motion.div
          className="mt-4 bg-white text-blue-700 p-3 rounded shadow-md max-w-xs text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm">
            Cet espace symbolise l&apos;exercice de respiration. Inspirez profondément, retenez et expirez pour retrouver votre <a href = "respiration" >calme.</a>
          </p>
        </motion.div>
      )}
    </div>
  );
}
