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
    <div className="p-10 max-w-4xl mx-auto bg-gradient-to-b from-green-50 to-blue-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-12 text-center text-green-800">{pageContent.title || "Foire Aux Questions"}</h1>
      <div className="space-y-8">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100">
          <h2 className="text-2xl font-semibold mb-6 text-green-700 flex items-center">
            <span className="mr-2">🌱</span> Questions Générales
          </h2>
          <div className="space-y-6">
            <div className="hover:bg-green-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-green-800">Qu'est-ce que CesiZen ?</h3>
              <p className="text-gray-700 leading-relaxed">CesiZen est une plateforme dédiée au bien-être et au développement personnel, offrant des activités variées et des outils de suivi émotionnel pour améliorer votre quotidien.</p>
            </div>
            <div className="hover:bg-green-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-green-800">Comment créer un compte ?</h3>
              <p className="text-gray-700 leading-relaxed">Cliquez sur le bouton "S'inscrire" en haut de la page et remplissez le formulaire avec vos informations personnelles. Une fois inscrit, vous aurez accès à toutes les fonctionnalités de la plateforme.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100">
          <h2 className="text-2xl font-semibold mb-6 text-blue-700 flex items-center">
            <span className="mr-2">🎯</span> Activités et Favoris
          </h2>
          <div className="space-y-6">
            <div className="hover:bg-blue-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-blue-800">Comment ajouter une activité aux favoris ?</h3>
              <p className="text-gray-700 leading-relaxed">Sur la page des activités, cliquez sur l'icône cœur à côté de l'activité que vous souhaitez ajouter aux favoris. Vous pourrez retrouver toutes vos activités favorites dans la section "Mes Favoris".</p>
            </div>
            <div className="hover:bg-blue-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-blue-800">Comment filtrer les activités ?</h3>
              <p className="text-gray-700 leading-relaxed">Utilisez les filtres en haut de la page des activités pour trier par catégorie, niveau de difficulté ou durée. Vous pouvez également utiliser la barre de recherche pour trouver une activité spécifique.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
          <h2 className="text-2xl font-semibold mb-6 text-purple-700 flex items-center">
            <span className="mr-2">🧘</span> Suivi Émotionnel
          </h2>
          <div className="space-y-6">
            <div className="hover:bg-purple-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-purple-800">Comment suivre mes émotions ?</h3>
              <p className="text-gray-700 leading-relaxed">Dans la section "Suivi Émotionnel", vous pouvez enregistrer vos émotions quotidiennes et ajouter des commentaires pour mieux comprendre vos ressentis. Les données sont visualisées sous forme de graphiques pour un suivi facile.</p>
            </div>
            <div className="hover:bg-purple-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-purple-800">Qu'est-ce que le test de stress ?</h3>
              <p className="text-gray-700 leading-relaxed">Le test de stress vous permet d'évaluer votre niveau de stress actuel en répondant à une série de questions. Les résultats vous donnent un aperçu de votre état émotionnel et des recommandations personnalisées.</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100">
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700 flex items-center">
            <span className="mr-2">💫</span> Contact et Support
          </h2>
          <div className="space-y-6">
            <div className="hover:bg-indigo-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-indigo-800">Comment contacter le support ?</h3>
              <p className="text-gray-700 leading-relaxed">Pour toute question ou problème technique, vous pouvez nous contacter via le formulaire de contact ou envoyer un email à support@cesizen.com. Notre équipe s'engage à vous répondre dans les plus brefs délais.</p>
            </div>
            <div className="hover:bg-indigo-50/50 p-4 rounded-xl transition-colors duration-200">
              <h3 className="font-medium text-xl mb-3 text-indigo-800">Mes données sont-elles sécurisées ?</h3>
              <p className="text-gray-700 leading-relaxed">Oui, nous accordons une importance primordiale à la sécurité de vos données. Toutes vos informations sont cryptées et stockées de manière sécurisée. Nous ne partageons jamais vos données personnelles avec des tiers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
