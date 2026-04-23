export default function TermsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">📜 Conditions d'utilisation</h1>
        <p className="page-subtitle">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">⚖️</div>
          <div>
            <div className="card-title">Conditions générales d'utilisation</div>
            <div className="card-subtitle">En utilisant GestiÉtudiants, vous acceptez ces conditions</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>1. Acceptation des conditions</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              En accédant et en utilisant GestiÉtudiants, vous acceptez d'être lié par ces conditions d'utilisation.
              Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre application.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>2. Utilisation autorisée</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Vous vous engagez à utiliser GestiÉtudiants uniquement pour des fins légitimes de gestion académique.
              Vous ne devez pas :
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 24, color: 'var(--text-2)', lineHeight: 1.8 }}>
              <li>Utiliser l'application pour des activités illégales</li>
              <li>Tenter d'accéder à des comptes non autorisés</li>
              <li>Perturber ou endommager le fonctionnement de l'application</li>
              <li>Partager vos identifiants de connexion</li>
            </ul>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>3. Comptes utilisateurs</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Vous êtes responsable de la confidentialité de votre mot de passe et de toutes les activités
              effectuées sous votre compte. Vous devez nous informer immédiatement de toute utilisation non autorisée.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>4. Propriété intellectuelle</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              L'application GestiÉtudiants et son code source sont la propriété de ses développeurs.
              Le code est open source et disponible sur GitHub sous licence MIT.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>5. Limitation de responsabilité</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              GestiÉtudiants est fournie "telle quelle". Nous ne garantissons pas que l'application sera
              exempte d'erreurs ou disponible à 100% du temps. En cas de perte de données, nous ne pourrons
              être tenus responsables.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>6. Modifications</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications
              entrent en vigueur dès leur publication.
            </p>
          </section>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--primary-light)', borderRadius: 8, fontSize: '0.85rem' }}>
          <strong>📧 Contact :</strong> support@gestietudiants.com
        </div>
      </div>
    </div>
  )
}