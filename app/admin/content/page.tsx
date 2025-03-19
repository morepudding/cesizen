"use client";

import { useEffect, useState } from "react";

interface PageContent {
  page: string;
  title: string;
  content: string;
}

export default function AdminContentPage() {
  const [page, setPage] = useState("about"); // ✅ On commence sur "À Propos"
  const [content, setContent] = useState<PageContent>({ page: "about", title: "", content: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    fetchContent();
  }, [page]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?page=${page}`);
      const data = await res.json();
      setContent(data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement du contenu");
    }
  };

  const handleUpdateContent = async () => {
    try {
      await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      alert("Contenu mis à jour !");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">📝 Gestion des Pages</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="mr-2">Page :</label>
        <select
          value={page}
          onChange={(e) => setPage(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="about">À Propos</option>
          <option value="faq">FAQ</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block">Titre :</label>
        <input
          type="text"
          value={content.title}
          onChange={(e) => setContent({ ...content, title: e.target.value })}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block">Contenu :</label>
        <textarea
          value={content.content}
          onChange={(e) => setContent({ ...content, content: e.target.value })}
          className="border p-2 rounded w-full h-32"
        />
      </div>

      <button onClick={handleUpdateContent} className="bg-blue-500 text-white px-4 py-2 rounded">
        Enregistrer
      </button>
    </div>
  );
}
