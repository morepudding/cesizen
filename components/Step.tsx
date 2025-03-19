"use client";
import React from "react";

type StepProps = {
  side: "left" | "right";
  component: React.ReactNode; // Élément interactif
  deco: React.ReactNode;      // Élément décoratif
};

/**
 * Chaque 'étape' place l'élément interactif d'un côté (left/right)
 * et un élément décoratif de l'autre côté, 
 * en s'alignant sur la 'ligne' (ou le chemin) au centre.
 */
export function Step({ side, component, deco }: StepProps) {
  const isLeft = side === "left";

  return (
    <div
      className={`relative flex items-center ${
        isLeft ? "justify-start" : "justify-end"
      } px-4`}
      style={{ minHeight: "200px" }} // Ajuste selon la taille souhaitée
    >
      {/* Point central qui touche le chemin */}
      <div className="w-3 h-3 bg-gray-400 rounded-full absolute left-1/2 -translate-x-1/2 z-20" />

      {/* Élément interactif */}
      <div
        className={`relative z-10 w-[200px] h-[200px] ${
          isLeft ? "mr-8" : "ml-8"
        } flex items-center justify-center`}
      >
        {component}
      </div>

      {/* Décoration purement esthétique en face (sur desktop) */}
      <div
        className={`hidden md:block absolute top-1/2 -translate-y-1/2 ${
          isLeft ? "right-[10%]" : "left-[10%]"
        }`}
      >
        {deco}
      </div>
    </div>
  );
}
