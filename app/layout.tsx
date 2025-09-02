"use client";

import { SessionProvider, signOut, useSession } from "next-auth/react";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiSun, FiMoon, FiUser } from "react-icons/fi";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SessionProvider>
            <Navbar />
            <main className="container mx-auto mt-6 px-4">{children}</main>
            <Footer />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

function Navbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-green-100 to-green-50 shadow-inner px-8 py-4 flex justify-between items-center rounded-b-2xl border-b border-green-200">
      {/* Logo */}
      <Link href="/">
        <Image
          src="/logo.png"
          alt="CesiZen Logo"
          width={140}
          height={40}
          priority
          className="cursor-pointer"
        />
      </Link>

      {/* Liens de navigation */}
      <ul className="flex space-x-6 text-lg text-green-800">
        <li>
          <Link href="/activities" className="hover:text-green-600 transition">
            Activités
          </Link>
        </li>
        <li>
          <Link href="/tracker" className="hover:text-green-600 transition">
            Tracker
          </Link>
        </li>
        <li>
          <Link href="/stress" className="hover:text-green-600 transition">
            Test Stress
          </Link>
        </li>
        <li>
          <Link href="/respiration" className="hover:text-green-600 transition">
            Respiration
          </Link>
        </li>
        <li>
          <Link href="/faq" className="hover:text-green-600 transition">
            FAQ
          </Link>
        </li>
        {session && (
          <li>
            <Link href="/support" className="hover:text-green-600 transition">
              Support
            </Link>
          </li>
        )}
        <li>
          <Link href="/zenGarden" className="hover:text-green-600 transition">
            Jardin Zen
          </Link>
        </li>
        {/* Lien "Mon profil" avec icône (affiché si la session existe) */}
        {session && (
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-1 hover:text-green-600 transition"
            >
              <FiUser className="text-xl" />
              <span>Mon profil</span>
            </Link>
          </li>
        )}
      </ul>

      {/* Boutons Connexion/Déconnexion et Toggle Dark Mode */}
      <div className="flex items-center space-x-4">
        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-green-200 text-green-900 px-4 py-2 rounded hover:bg-green-300 transition"
          >
            Se déconnecter
          </button>
        ) : (
          <Link
            href="/auth/login"
            className="bg-green-200 text-green-900 px-4 py-2 rounded hover:bg-green-300 transition"
          >
            Se connecter
          </Link>
        )}
        {mounted && (
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-full bg-green-100 dark:bg-gray-700 border border-green-200 hover:scale-105 transition"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-green-900 text-white py-4 mt-10 text-center">
      <p>&copy; {new Date().getFullYear()} CESIZen - L'application de votre santé mentale.</p>
    </footer>
  );
}
