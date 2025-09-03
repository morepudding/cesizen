// pages/index.tsx
"use client";
import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';

const ZenGarden = dynamic(() => import('@/components/ZenGarden'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[600px]">
      <div className="animate-pulse text-center">
        <div className="w-32 h-32 bg-green-100 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-500">Chargement du jardin zen...</p>
      </div>
    </div>
  )
});

const Home: React.FC = () => {
  // Tracker les visites du jardin zen pour les métriques
  useEffect(() => {
    // Envoyer une métrique de visite du jardin zen
    fetch('/api/zen-visit', { method: 'POST' }).catch(() => {
      // Échec silencieux - on ne veut pas casser l'UX pour les métriques
    });
  }, []);

  return (
    <div>
      <h1>Mon Jardin Zen Personnel</h1>
      <ZenGarden />
    </div>
  );
};

export default Home;
