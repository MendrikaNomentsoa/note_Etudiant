import { useState } from 'react'

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "Comment réinitialiser mon mot de passe ?",
      answer: "Cliquez sur 'Mot de passe oublié ?' sur la page de connexion. Entrez votre email, vous recevrez un lien pour réinitialiser votre mot de passe. Ce lien est valable 1 heure."
    },
    {
      question: "Puis-je modifier le numéro d'un étudiant après l'avoir créé ?",
      answer: "Non, le numéro étudiant est unique et ne peut pas être modifié après création. C'est une mesure pour éviter les doublons et garantir l'intégrité des données."
    },
    {
      question: "Les notes sont-elles sauvegardées automatiquement ?",
      answer: "Oui, chaque fois que vous ajoutez ou modifiez un étudiant, les données sont immédiatement sauvegardées dans la base de données MongoDB."
    },
    {
      question: "Comment exporter les données des étudiants ?",
      answer: "Actuellement, l'exportation n'est pas disponible nativement, mais vous pouvez copier les données depuis le tableau. Une fonction d'export CSV est prévue pour une prochaine version."
    },
    {
      question: "Puis-je avoir plusieurs administrateurs ?",
      answer: "Oui, le premier utilisateur inscrit devient automatiquement administrateur. Les administrateurs ont les mêmes droits que les utilisateurs standards pour la gestion des étudiants."
    },
    {
      question: "Les données sont-elles sécurisées ?",
      answer: "Oui, les mots de passe sont hachés avec bcrypt, et toutes les communications utilisent HTTPS en production. Vos données sont stockées de manière sécurisée dans MongoDB."
    },
    {
      question: "Comment contacter le support technique ?",
      answer: "Vous pouvez nous contacter par email à support@gestietudiants.com. Nous vous répondrons dans les 24-48h ouvrées."
    },
    {
      question: "Y a-t-il une limite du nombre d'étudiants ?",
      answer: "Il n'y a pas de limite théorique. L'application peut gérer des milliers d'étudiants sans problème de performance."
    },
    {
      question: "Puis-je importer des étudiants depuis un fichier Excel ?",
      answer: "Cette fonctionnalité est en développement. Pour l'instant, vous devez ajouter les étudiants un par un via le formulaire."
    },
    {
      question: "Les moyennes sont-elles arrondies ?",
      answer: "Oui, les moyennes sont calculées et affichées avec 2 décimales (ex: 14.75/20)."
    }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">❓ FAQ - Foire aux questions</h1>
        <p className="page-subtitle">Les réponses aux questions les plus fréquentes</p>
      </div>

      <div className="faq-container">
        {faqs.map((faq, index) => (
          <div key={index} className="card faq-item" style={{ marginBottom: 12, cursor: 'pointer' }}>
            <div 
              className="faq-question"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px'
              }}
            >
              <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>
                {faq.question}
              </h3>
              <span style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
                {openIndex === index ? '−' : '+'}
              </span>
            </div>
            {openIndex === index && (
              <div 
                className="faq-answer"
                style={{
                  padding: '0 20px 20px 20px',
                  borderTop: '1px solid var(--border)',
                  color: 'var(--text-2)',
                  lineHeight: 1.6
                }}
              >
                <p style={{ marginTop: 16 }}>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section contact */}
      <div className="card" style={{ marginTop: 24, textAlign: 'center', background: 'var(--primary-light)' }}>
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>💬</div>
        <h3>Vous n'avez pas trouvé votre réponse ?</h3>
        <p style={{ marginTop: 8, marginBottom: 16, color: 'var(--text-2)' }}>
          Notre équipe est là pour vous aider
        </p>
        <button 
          className="btn btn-primary"
          onClick={() => window.location.href = 'mailto:support@gestietudiants.com'}
        >
          📧 Contacter le support
        </button>
      </div>
    </div>
  )
}