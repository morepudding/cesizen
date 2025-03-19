"use client";
import { useState, useEffect } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";

export default function AmbientSound() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const sound = new Audio("../public/ambient-sound.mp3"); // Place ton fichier audio dans le dossier public
    sound.loop = true;
    sound.volume = 0.2; // Volume discret
    sound.play().catch((error) => {
      // Auto-play peut être bloqué; dans ce cas, l'utilisateur devra lancer le son manuellement.
      console.log("Auto-play blocked:", error);
    });
    setAudio(sound);

    return () => {
      sound.pause();
    };
  }, []);

  const toggleSound = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <button
      onClick={toggleSound}
      className="fixed bottom-4 right-4 bg-green-200 p-2 rounded-full shadow-lg hover:bg-green-300 transition z-50"
    >
      {isPlaying ? <FiVolume2 size={24} /> : <FiVolumeX size={24} />}
    </button>
  );
}
