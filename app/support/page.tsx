"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Ticket = {
  id: number;
  subject: string;
  description: string;
  type: string;
  priority: string;
  status: string;
  createdAt: string;
  responses: Array<{
    id: number;
    message: string;
    isAdmin: boolean;
    createdAt: string;
    user: { name: string };
  }>;
};

export default function SupportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"new" | "tickets">("new");
  
  // Formulaire nouveau ticket
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("AIDE");
  const [priority, setPriority] = useState("MOYENNE");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  
  // Liste des tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);

  // Redirection si non connecté
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  // Charger les tickets
  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/tickets");
      const data = await response.json();
      if (response.ok) {
        setTickets(data.tickets);
      }
    } catch (error) {
      console.error("Erreur chargement tickets:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (session && activeTab === "tickets") {
      loadTickets();
    }
  }, [session, activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetch("/api/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, description, type, priority }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Ticket créé avec succès !");
        setSubject("");
        setDescription("");
        setType("AIDE");
        setPriority("MOYENNE");
      } else {
        setMessage(data.error || "Erreur lors de la création");
      }
    } catch {
      setMessage("Erreur de connexion");
    }
    setIsSubmitting(false);
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Chargement...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Support & Assistance</h1>

        {/* Onglets */}
        <div className="flex mb-8 bg-white rounded-lg shadow-sm">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-3 px-6 text-center font-medium rounded-l-lg transition-colors ${
              activeTab === "new"
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Nouveau Ticket
          </button>
          <button
            onClick={() => setActiveTab("tickets")}
            className={`flex-1 py-3 px-6 text-center font-medium rounded-r-lg transition-colors ${
              activeTab === "tickets"
                ? "bg-blue-500 text-white"
                : "bg-gray-50 text-gray-700 hover:bg-gray-100"
            }`}
          >
            Mes Tickets
          </button>
        </div>

        {/* Contenu des onglets */}
        {activeTab === "new" ? (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Créer un nouveau ticket</h2>
            
            {message && (
              <div className={`mb-4 p-3 rounded ${
                message.includes("succès") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet *
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Résumé de votre demande"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de demande
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="AIDE">Demande d&apos;aide</option>
                    <option value="BUG">Signaler un bug</option>
                    <option value="SUGGESTION">Suggestion</option>
                    <option value="AUTRE">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priorité
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="BASSE">Basse</option>
                    <option value="MOYENNE">Moyenne</option>
                    <option value="HAUTE">Haute</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="Décrivez votre demande en détail..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Création en cours..." : "Créer le ticket"}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold mb-6">Mes tickets</h2>
            
            {loading ? (
              <div className="text-center py-8">Chargement des tickets...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Aucun ticket trouvé. Créez votre premier ticket !
              </div>
            ) : (
              <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-lg">{ticket.subject}</h3>
                      <div className="flex gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.status === "OUVERT" ? "bg-yellow-100 text-yellow-800" :
                          ticket.status === "EN_COURS" ? "bg-blue-100 text-blue-800" :
                          ticket.status === "RESOLU" ? "bg-green-100 text-green-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {ticket.status.replace("_", " ")}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          ticket.priority === "HAUTE" ? "bg-red-100 text-red-800" :
                          ticket.priority === "MOYENNE" ? "bg-yellow-100 text-yellow-800" :
                          "bg-green-100 text-green-800"
                        }`}>
                          {ticket.priority}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-2">{ticket.description}</p>
                    <div className="text-sm text-gray-500">
                      Créé le {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                    </div>
                    {ticket.responses.length > 0 && (
                      <div className="mt-3 pl-4 border-l-2 border-blue-200">
                        <p className="text-sm text-blue-600 font-medium">
                          {ticket.responses.length} réponse(s)
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
