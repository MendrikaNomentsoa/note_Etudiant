import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function DocumentationPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const docs = [
    {
      id: 1,
      title: "Comment ajouter un étudiant ?",
      category: "débutant",
      content: "Pour ajouter un étudiant, rendez-vous dans la section 'Ajout étudiant' via le menu latéral. Remplissez le formulaire avec le numéro étudiant, le nom et les notes. La moyenne est calculée automatiquement.",
      steps: [
        "Cliquez sur '➕ Ajout étudiant' dans le menu",
        "Remplissez le numéro étudiant (ex: ET-2024-001)",
        "Entrez le nom complet",
        "Saisissez les notes de Math et Physique (0-20)",
        "Cliquez sur 'Ajouter étudiant'"
      ]
    },
    {
      id: 2,
      title: "Comment fonctionne le calcul de moyenne ?",
      category: "fonctionnalités",
      content: "La moyenne est calculée automatiquement selon la formule : (Note Math + Note Physique) / 2. Un étudiant est considéré comme admis si sa moyenne est ≥ 10/20.",
      formula: "Moyenne = (Mathématiques + Physique) ÷ 2",
      seuil: "Admission : ≥ 10/20"
    },
    {
      id: 3,
      title: "Comment modifier ou supprimer un étudiant ?",
      category: "crud",
      content: "Dans la page 'Liste & CRUD', chaque étudiant dispose de boutons d'action pour modifier (✏️) ou supprimer (🗑️).",
      steps: [
        "Allez dans '📋 Liste & CRUD'",
        "Trouvez l'étudiant concerné",
        "Cliquez sur ✏️ pour modifier ou 🗑️ pour supprimer",
        "Confirmez l'action dans la boîte de dialogue"
      ]
    },
    {
      id: 4,
      title: "Comment interpréter le bilan de classe ?",
      category: "analyse",
      content: "Le bilan de classe vous offre une vue d'ensemble des performances avec des graphiques et statistiques détaillées.",
      features: [
        "Moyenne générale de la classe",
        "Meilleure et pire moyenne",
        "Taux de réussite",
        "Graphique des moyennes par étudiant",
        "Répartition admis/redoublants"
      ]
    },
    {
      id: 5,
      title: "Personnaliser mon profil",
      category: "compte",
      content: "Vous pouvez modifier vos informations personnelles et changer votre mot de passe dans la section 'Mon profil'.",
      steps: [
        "Cliquez sur '👤 Mon profil'",
        "Modifiez votre nom complet ou email",
        "Ou changez votre mot de passe dans l'onglet dédié",
        "Enregistrez les modifications"
      ]
    },
    {
      id: 6,
      title: "Utiliser le mode sombre",
      category: "interface",
      content: "L'application supporte le mode sombre pour un confort visuel optimal, surtout en environnement peu lumineux.",
      steps: [
        "Repérez le bouton 🌙/☀️ en bas à droite de l'écran",
        "Cliquez pour basculer entre mode clair et sombre",
        "Votre préférence est automatiquement sauvegardée"
      ]
    },
    {
      id: 7,
      title: "Trier et filtrer les étudiants",
      category: "fonctionnalités",
      content: "La page liste vous permet de trier et filtrer les étudiants pour une meilleure organisation.",
      features: [
        "Trier par nom, numéro, notes ou moyenne",
        "Rechercher par nom ou numéro d'étudiant",
        "Affichage des derniers ajouts en premier"
      ]
    },
    {
      id: 8,
      title: "Redimensionner la sidebar",
      category: "interface",
      content: "Vous pouvez ajuster la largeur du menu latéral selon vos préférences.",
      steps: [
        "Ouvrez le menu si nécessaire",
        "Placez le curseur sur le bord droit du menu",
        "Tirez pour redimensionner",
        "La largeur est automatiquement sauvegardée"
      ]
    }
  ]

  const categories = ['all', 'débutant', 'fonctionnalités', 'crud', 'analyse', 'compte', 'interface']
  
  const filteredDocs = docs.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📚 Documentation</h1>
        <p className="page-subtitle">Guide d'utilisation complet de GestiÉtudiants</p>
      </div>

      {/* Barre de recherche */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="search-bar-wrap" style={{ width: '100%' }}>
          <span className="search-icon">🔍</span>
          <input
            className="search-bar"
            style={{ width: '100%' }}
            placeholder="Rechercher dans la documentation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Filtres par catégorie */}
      <div className="doc-categories" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn ${activeCategory === cat ? 'btn-primary' : 'btn-secondary'} btn-sm`}
          >
            {cat === 'all' && '📋 Tous'}
            {cat === 'débutant' && '🎯 Débutant'}
            {cat === 'fonctionnalités' && '⚙️ Fonctionnalités'}
            {cat === 'crud' && '📝 CRUD'}
            {cat === 'analyse' && '📊 Analyse'}
            {cat === 'compte' && '👤 Compte'}
            {cat === 'interface' && '🎨 Interface'}
          </button>
        ))}
      </div>

      {/* Grille des articles */}
      <div className="docs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 20 }}>
        {filteredDocs.map(doc => (
          <div key={doc.id} className="card doc-card" style={{ cursor: 'pointer' }}>
            <div className="doc-header">
              <span className={`doc-category badge badge-info`}>
                {doc.category}
              </span>
              <h3 style={{ marginTop: 12, marginBottom: 8 }}>{doc.title}</h3>
            </div>
            <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginBottom: 12 }}>
              {doc.content.substring(0, 120)}...
            </p>
            {doc.steps && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  📖 Afficher les étapes
                </summary>
                <ol style={{ marginTop: 8, paddingLeft: 20, fontSize: '0.8rem', color: 'var(--text-3)' }}>
                  {doc.steps.map((step, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{step}</li>
                  ))}
                </ol>
              </details>
            )}
            {doc.features && (
              <details style={{ marginTop: 12 }}>
                <summary style={{ color: 'var(--primary)', fontSize: '0.8rem', cursor: 'pointer' }}>
                  ✨ Fonctionnalités incluses
                </summary>
                <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: '0.8rem', color: 'var(--text-3)' }}>
                  {doc.features.map((feature, idx) => (
                    <li key={idx} style={{ marginBottom: 4 }}>{feature}</li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </div>

      {filteredDocs.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <div className="empty-title">Aucun résultat trouvé</div>
          <p className="empty-text">Essayez d'autres mots-clés ou catégories</p>
        </div>
      )}
    </div>
  )
}