export default function PrivacyPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🔒 Politique de confidentialité</h1>
        <p className="page-subtitle">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">🔐</div>
          <div>
            <div className="card-title">Protection de vos données</div>
            <div className="card-subtitle">Comment nous utilisons et protégeons vos informations</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>1. Collecte des informations</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Nous collectons uniquement les informations nécessaires au fonctionnement de l'application :
              nom d'utilisateur, email, nom complet, et les notes des étudiants. Aucune donnée sensible
              n'est stockée sans votre consentement explicite.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>2. Utilisation des données</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Vos données sont utilisées exclusivement pour :
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 24, color: 'var(--text-2)', lineHeight: 1.8 }}>
              <li>Gérer les comptes utilisateurs</li>
              <li>Calculer et afficher les moyennes des étudiants</li>
              <li>Générer des bilans de classe</li>
              <li>Améliorer l'expérience utilisateur</li>
            </ul>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>3. Protection des données</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
              mots de passe hachés (bcrypt), connexions sécurisées (HTTPS), et accès restreint à la base de données.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>4. Vos droits</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Conformément au RGPD, vous avez le droit d'accéder, modifier ou supprimer vos données personnelles.
              Pour toute demande, contactez-nous à <a href="mailto:support@gestietudiants.com" style={{ color: 'var(--primary)' }}>support@gestietudiants.com</a>.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>5. Cookies</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Nous utilisons uniquement les cookies essentiels au fonctionnement de l'application
              (authentification, préférences de thème). Aucun cookie tiers n'est utilisé.
            </p>
          </section>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--primary-light)', borderRadius: 8, fontSize: '0.85rem' }}>
          <strong>📧 Contact RGPD :</strong> support@gestietudiants.com
        </div>
      </div>
    </div>
  )
}