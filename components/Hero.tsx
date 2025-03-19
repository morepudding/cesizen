"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Hero() {
  // Variantes d'animation pour un effet de fade & slide
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Fond d'écran avec effet parallax (background fixe) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/garden-zen.jpg)" }}
      ></div>
      {/* Overlay dégradé pour adoucir l'image */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-50 opacity-80"></div>
      {/* Contenu animé */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-green-900 mb-6"
          variants={item}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          Bienvenue dans votre Jardin Zen
        </motion.h1>
        <motion.p
          className="text-xl md:text-2xl max-w-2xl text-green-800 mb-8"
          variants={item}
          initial="hidden"
          animate="visible"
          transition={{ duration: 1 }}
        >
          Explorez des outils uniques pour harmoniser votre esprit et réduire votre stress.
        </motion.p>
        <motion.div
          variants={item}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8 }}
        >
          <Link
            href="#interactive"
            className="inline-block bg-green-200 text-green-900 px-6 py-3 rounded-full text-lg font-semibold shadow-md hover:bg-green-300 transition"
          >
            Embarquez pour votre promenade
          </Link>
        </motion.div>
      </div>
      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-6 border-b-2 border-green-900"
        ></motion.div>
      </div>
    </section>
  );
}
