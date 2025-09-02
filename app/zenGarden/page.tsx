// pages/index.tsx
"use client";
import React from 'react';
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
  return (
    <div>
      <h1>Mon Jardin Zen Personnel</h1>
      <ZenGarden />
    </div>
  );
};

export default Home;
