"use client";
import Hero from "../components/Hero";
import InteractiveBassin from "../components/InteractiveBassin";
import InteractiveStone from "../components/InteractiveStone";
import InteractiveLantern from "../components/InteractiveLantern";
import InteractiveBridge from "../components/InteractiveBridge";
import InteractiveProfile from "../components/InteractiveProfile";
import InteractiveFAQ from "../components/InteractiveFAQ";
import AmbientSound from "../components/AmbientSound";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section id="interactive" className="relative bg-gray-100 pb-20 min-h-[1000px]">
        <h2 className="text-3xl font-bold text-gray-700 text-center pt-12 mb-4">
          Votre Promenade Zen
        </h2>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8 px-4">
          Parcourez ce chemin pour découvrir comment nos outils peuvent vous aider à atteindre la sérénité.
          Suivez la courbe et explorez chaque étape en formant un chemin en forme de 8.
        </p>

        {/* Image de fond : le jardin zen */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-0 w-full h-full">
          <img
            src="../../jardinzen.png"
            alt="Chemin Zen"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Conteneur pour les éléments interactifs */}
        <div className="relative z-10 w-full h-[1000px]">
          {/* 
            On positionne chaque élément à des coordonnées absolues
            pour dessiner un « ∞ » grossier : on commence en haut à gauche,
            on descend et on remonte vers la droite, etc.
          */}

          {/* 1. Bassin (haut gauche) */}
          <div className="absolute left-[15%] top-[20%]">
            <InteractiveBassin />
          </div>

          {/* 2. Pierre (légèrement plus bas, au centre gauche) */}
          <div className="absolute left-[40%] top-[15%]">
            <InteractiveStone />
          </div>

          {/* 3. Lanterne (bas à gauche) */}
          <div className="absolute left-[75%] top-[20%]">
            <InteractiveLantern />
          </div>

          {/* 4. Pont (bas à droite) */}
          <div className="absolute left-[10%] top-[60%]">
            <InteractiveBridge />
          </div>

          {/* 5. Profil (remontée vers la droite) */}
          <div className="absolute left-[40%] top-[55%]">
            <InteractiveProfile />
          </div>

          {/* 6. FAQ (plus haut, à droite) */}
          <div className="absolute left-[65%] top-[80%]">
            <InteractiveFAQ />
          </div>
        </div>
      </section>

      <AmbientSound />
    </>
  );
}
