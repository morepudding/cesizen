"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import stressAnimation from "../assets/stressAnimation.json"; // ajuste le chemin si nécessaire

export default function InteractiveBridge() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <motion.div
        className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: showInfo ? 1 : 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setShowInfo((prev) => !prev)}
      >
        <Lottie 
          animationData={stressAnimation} 
          autoPlay={showInfo}
          loop={showInfo}
          style={{ width: "100%", height: "100%" }}
        />
      </motion.div>
      {showInfo && (
        <motion.div
          className="mt-4 bg-white text-purple-700 p-3 rounded shadow-md max-w-xs text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm">
            Faites une activité pour vous détendre et vous sentir mieux, avec notre liste d'activités <a href = "activity">ici.</a>
          </p>
        </motion.div>
      )}
    </div>
  );
}
