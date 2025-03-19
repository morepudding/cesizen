"use client";

import { useEffect, useState } from "react";

interface PageContent {
  title: string;
  content: string;
}

export default function FAQPage() {
  const [pageContent, setPageContent] = useState<PageContent>({ title: "", content: "" });

  useEffect(() => {
    const fetchContent = async () => {
      const res = await fetch("/api/content?page=faq");
      const data = await res.json();
      setPageContent(data);
    };

    fetchContent();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{pageContent.title || "FAQ"}</h1>
      <p className="text-lg">{pageContent.content || "Cette page est en cours de modification."}</p>
    </div>
  );
}
