"use client";
import React from "react";

type ZenDecoProps = {
  type: "lampion" | "bamboo" | "rock" | "flower";
};

/**
 * Placeholder de décorations. 
 * Remplace par de vraies images/SVG pour un rendu plus esthétique.
 */
export function ZenDeco({ type }: ZenDecoProps) {
  switch (type) {
    case "lampion":
      return <div className="w-12 h-12 bg-red-100 rounded-full" title="Lampion" />;
    case "bamboo":
      return <div className="w-12 h-20 bg-green-300 rounded-md" title="Bambou" />;
    case "rock":
      return <div className="w-14 h-14 bg-gray-300 rounded-full" title="Roc" />;
    case "flower":
      return <div className="w-12 h-12 bg-pink-200 rounded-full" title="Fleur" />;
    default:
      return null;
  }
}
