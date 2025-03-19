"use client";
import React from "react";

/**
 * Dessine un chemin large et sinueux, plus contrasté, 
 * pour qu'il ressorte clairement comme un sentier.
 */
export function WideCheminSinueux() {
  return (
    <svg
      className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-[400px] h-[1200px] pointer-events-none"
      viewBox="0 0 400 1200"
      preserveAspectRatio="none"
    >
      <path
        d="
          M 200,0                        /* Départ au milieu (x=200, y=0) */
          C 350,150  50,250   200,400    /* Courbe en S plus ample */
          C 350,550  50,650   200,800
          C 350,950  50,1050  200,1200   /* Arrivée en bas (x=200, y=1200) */
          L 0,1200                       /* On va à la bordure gauche en bas */
          L 0,0                          /* On remonte tout droit en haut */
          Z                              /* On referme la forme */
        "
        fill="#8BC98B"         /* Vert un peu plus soutenu */
        stroke="#ffffff"       /* Contour blanc */
        strokeWidth={5}
        style={{ opacity: 0.95 }}
      />
    </svg>
  );
}
