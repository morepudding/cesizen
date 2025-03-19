"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type UserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null;
    };
  }
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user || session.user.role !== "admin") {
      router.push("/auth/login"); // Redirige si pas admin
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <p>Chargement...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Espace Admin</h1>
      <p>Bienvenue, {session?.user?.email} !</p>
    </div>
  );
}
