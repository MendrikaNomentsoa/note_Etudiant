export default function CookiesPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🍪 Politique des cookies</h1>
        <p className="page-subtitle">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-icon">🍪</div>
          <div>
            <div className="card-title">Gestion des cookies</div>
            <div className="card-subtitle">Comment nous utilisons les cookies sur GestiÉtudiants</div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>Qu'est-ce qu'un cookie ?</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Un cookie est un petit fichier texte stocké sur votre ordinateur ou appareil mobile lorsque
              vous visitez un site web. Il permet de mémoriser vos préférences et de vous offrir une
              meilleure expérience de navigation.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>Cookies que nous utilisons</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: 10, textAlign: 'left' }}>Nom du cookie</th>
                    <th style={{ padding: 10, textAlign: 'left' }}>Objectif</th>
                    <th style={{ padding: 10, textAlign: 'left' }}>Durée</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 10 }}><code>student_app_user</code></td>
                    <td style={{ padding: 10 }}>Authentification utilisateur (session)</td>
                    <td style={{ padding: 10 }}>Session</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 10 }}><code>darkMode</code></td>
                    <td style={{ padding: 10 }}>Préférence du thème (clair/sombre)</td>
                    <td style={{ padding: 10 }}>Persistant</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 10 }}><code>sidebarOpen</code></td>
                    <td style={{ padding: 10 }}>État du menu latéral</td>
                    <td style={{ padding: 10 }}>Persistant</td>
                  </tr>
                  <tr>
                    <td style={{ padding: 10 }}><code>sidebarWidth</code></td>
                    <td style={{ padding: 10 }}>Largeur personnalisée du menu</td>
                    <td style={{ padding: 10 }}>Persistant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>Cookies tiers</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              GestiÉtudiants n'utilise <strong>aucun cookie tiers</strong> (publicité, analytics, réseaux sociaux).
              Vos données ne sont jamais partagées avec des services externes.
            </p>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>Gérer vos cookies</h3>
            <p style={{ color: 'var(--text-2)', lineHeight: 1.6 }}>
              Vous pouvez à tout moment :
            </p>
            <ul style={{ marginTop: 8, paddingLeft: 24, color: 'var(--text-2)', lineHeight: 1.8 }}>
              <li>Supprimer les cookies via les paramètres de votre navigateur</li>
              <li>Désactiver complètement les cookies (cela peut affecter le fonctionnement de l'application)</li>
              <li>Configurer votre navigateur pour être averti avant qu'un cookie soit déposé</li>
            </ul>
          </section>

          <section>
            <h3 style={{ marginBottom: 12, color: 'var(--primary)' }}>Paramètres par navigateur</h3>
            <ul style={{ marginTop: 8, paddingLeft: 24, color: 'var(--text-2)', lineHeight: 1.8 }}>
              <li><strong>Chrome :</strong> Paramètres → Confidentialité et sécurité → Cookies</li>
              <li><strong>Firefox :</strong> Options → Vie privée et sécurité → Cookies</li>
              <li><strong>Safari :</strong> Préférences → Confidentialité → Cookies</li>
              <li><strong>Edge :</strong> Paramètres → Cookies et autorisations</li>
            </ul>
          </section>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--primary-light)', borderRadius: 8, fontSize: '0.85rem' }}>
          <strong>💡 Note importante :</strong> Les cookies sont essentiels pour le bon fonctionnement de l'application
          (connexion, préférences). Leur suppression peut entraîner une dégradation de l'expérience utilisateur.
        </div>
      </div>
    </div>
  )
}