"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Ticket {
  id: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  type: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
}

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => {
    if (status === "loading") return;
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.role === "ADMIN") {
      fetchTickets();
    }
  }, [session]);

  const fetchTickets = async () => {
    try {
      console.log("🔄 Récupération des tickets...");
      const response = await fetch("/api/admin/tickets");
      if (response.ok) {
        const data = await response.json();
        console.log("✅ Tickets récupérés:", data);
        setTickets(data);
      } else {
        console.error("❌ Erreur lors de la récupération:", response.status);
      }
    } catch (error) {
      console.error("❌ Erreur lors de la récupération des tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTicketStatus = async (id: number, status: string) => {
    try {
      console.log("🔄 Mise à jour du statut du ticket", id, "vers", status);
      const response = await fetch("/api/admin/tickets", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });

      if (response.ok) {
        console.log("✅ Statut mis à jour avec succès");
        setTickets(tickets.map(ticket => 
          ticket.id === id ? { ...ticket, status } : ticket
        ));
      } else {
        console.error("❌ Erreur lors de la mise à jour");
      }
    } catch (error) {
      console.error("❌ Erreur lors de la mise à jour du ticket:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OUVERT": return "bg-red-100 text-red-800";
      case "EN_COURS": return "bg-yellow-100 text-yellow-800";
      case "RESOLU": return "bg-green-100 text-green-800";
      case "FERME": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "BASSE": return "bg-blue-100 text-blue-800";
      case "MOYENNE": return "bg-yellow-100 text-yellow-800";
      case "HAUTE": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OUVERT": return "Ouvert";
      case "EN_COURS": return "En cours";
      case "RESOLU": return "Résolu";
      case "FERME": return "Fermé";
      default: return status;
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "BASSE": return "Basse";
      case "MOYENNE": return "Moyenne";
      case "HAUTE": return "Haute";
      default: return priority;
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    if (filter === "ALL") return true;
    return ticket.status === filter;
  });

  if (status === "loading") {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎫 Gestion des Tickets</h1>
          <p className="text-gray-600 mt-2">
            {loading ? "Chargement..." : `${filteredTickets.length} ticket(s) ${filter === "ALL" ? "au total" : "filtré(s)"}`}
          </p>
        </div>
        <button
          onClick={() => router.push("/admin")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          ← Retour
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filtrer par statut:
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="ALL">Tous</option>
          <option value="OUVERT">Ouverts</option>
          <option value="EN_COURS">En cours</option>
          <option value="RESOLU">Résolus</option>
          <option value="FERME">Fermés</option>
        </select>
      </div>

      {/* Liste des tickets */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4">Chargement des tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {filter === "ALL" ? "Aucun ticket trouvé." : `Aucun ticket avec le statut "${getStatusLabel(filter)}".`}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priorité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{ticket.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{ticket.subject}</p>
                        <p className="text-gray-500 truncate max-w-xs">
                          {ticket.description}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <p className="font-medium">{ticket.user.name}</p>
                        <p className="text-gray-500">{ticket.user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(ticket.priority)}`}>
                        {getPriorityLabel(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(ticket.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <select
                        value={ticket.status}
                        onChange={(e) => updateTicketStatus(ticket.id, e.target.value)}
                        className="text-xs border rounded px-2 py-1"
                      >
                        <option value="OUVERT">Ouvert</option>
                        <option value="EN_COURS">En cours</option>
                        <option value="RESOLU">Résolu</option>
                        <option value="FERME">Fermé</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Statistiques */}
      {!loading && tickets.length > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total</h3>
            <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Ouverts</h3>
            <p className="text-3xl font-bold text-red-600">
              {tickets.filter(t => t.status === "OUVERT").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">En cours</h3>
            <p className="text-3xl font-bold text-yellow-600">
              {tickets.filter(t => t.status === "EN_COURS").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Résolus</h3>
            <p className="text-3xl font-bold text-green-600">
              {tickets.filter(t => t.status === "RESOLU").length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}