import { useEffect, useState } from 'react'
import { getBilan } from '../api/students'
import { useToast } from '../context/ToastContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'

const COLORS = ['#059669', '#dc2626']

const StatCard = ({ icon, value, label, color }) => (
  <div className={`stat-card ${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: '#fff', border: '1px solid #e4e7f0',
        borderRadius: 8, padding: '9px 13px', fontSize: '0.82rem',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}>
        <p style={{ color: '#6b7280', marginBottom: 3 }}>{label}</p>
        <p style={{ color: '#6366f1', fontWeight: 700 }}>
          Moyenne : {payload[0].value} / 20
        </p>
      </div>
    )
  }
  return null
}

export default function BilanPage() {
  const { addToast } = useToast()
  const [bilan, setBilan]     = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBilan = async () => {
      setLoading(true)
      try {
        const res = await getBilan()
        setBilan(res.data.data)
      } catch (err) {
        addToast(err.displayMessage || 'Erreur de chargement du bilan', 'error')
      } finally {
        setLoading(false)
      }
    }
    fetchBilan()
  }, [addToast])

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <div className="skeleton" style={{ width: 240, height: 32, marginBottom: 8 }} />
          <div className="skeleton" style={{ width: 340, height: 18 }} />
        </div>
        <div className="stat-grid">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 14 }} />
          ))}
        </div>
        <div className="charts-grid">
          <div className="skeleton" style={{ height: 300, borderRadius: 14 }} />
          <div className="skeleton" style={{ height: 300, borderRadius: 14 }} />
        </div>
      </div>
    )
  }

  if (!bilan) {
    return (
      <div>
        <div className="page-header">
          <h1 className="page-title">Bilan de la classe</h1>
        </div>
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <div className="empty-title">Aucune donnée disponible</div>
            <p className="empty-text">Ajoutez des étudiants pour générer le bilan.</p>
          </div>
        </div>
      </div>
    )
  }

  const pieData = [
    { name: 'Admis',       value: bilan.nbAdmis },
    { name: 'Redoublants', value: bilan.nbRedoublants },
  ]

  const barData = [
    ...bilan.admis.map((s) => ({ nom: s.nom.split(' ')[0], moyenne: s.moyenne, status: 'admis' })),
    ...bilan.redoublants.map((s) => ({ nom: s.nom.split(' ')[0], moyenne: s.moyenne, status: 'redoublant' })),
  ].sort((a, b) => b.moyenne - a.moyenne)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Bilan de la classe</h1>
        <p className="page-subtitle">
          Vue d'ensemble — {bilan.totalEtudiants} étudiant{bilan.totalEtudiants > 1 ? 's' : ''} enregistré{bilan.totalEtudiants > 1 ? 's' : ''}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <StatCard icon="📐" value={bilan.moyenneClasse} label="Moyenne classe" color="purple" />
        <StatCard icon="⬇️" value={bilan.moyenneMin}   label="Moyenne min"   color="red"    />
        <StatCard icon="⬆️" value={bilan.moyenneMax}   label="Moyenne max"   color="blue"   />
        <StatCard icon="✅" value={bilan.nbAdmis}      label="Admis (≥ 10)"  color="green"  />
        <StatCard icon="⚠️" value={bilan.nbRedoublants} label="Redoublants"  color="red"    />
      </div>

      {/* Taux de réussite */}
      <div className="card" style={{
        marginBottom: 18,
        background: '#f5f3ff',
        borderColor: '#ddd6fe',
        display: 'flex', alignItems: 'center', gap: 18, padding: '18px 24px',
      }}>
        <span style={{ fontSize: '1.8rem' }}>🏆</span>
        <div>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 2 }}>Taux de réussite</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#6366f1', letterSpacing: -1 }}>
            {bilan.tauxReussite}
          </div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: 2 }}>Seuil d'admission</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#059669' }}>10 / 20</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Barres */}
        <div className="card chart-card">
          <p className="chart-title">📊 Moyennes par étudiant</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} margin={{ top: 0, right: 8, left: -20, bottom: 28 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f2f8" />
              <XAxis
                dataKey="nom"
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                domain={[0, 20]}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                ticks={[0, 5, 10, 15, 20]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="moyenne" radius={[5, 5, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.moyenne >= 10 ? '#059669' : '#dc2626'}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 6 }}>
            {[['#059669', 'Admis'], ['#dc2626', 'Redoublant']].map(([color, label]) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: '#6b7280' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: 'inline-block' }} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Camembert */}
        <div className="card chart-card">
          <p className="chart-title">🍩 Répartition admis / redoublants</p>
          {bilan.totalEtudiants === 0 ? (
            <div className="empty-state" style={{ padding: 36 }}>
              <p className="empty-text">Aucun étudiant</p>
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Legend
                    formatter={(value) => (
                      <span style={{ color: '#374151', fontSize: '0.82rem' }}>{value}</span>
                    )}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#fff', border: '1px solid #e4e7f0',
                      borderRadius: 8, color: '#111827', fontSize: '0.82rem',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 28, marginTop: 6 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>{bilan.nbAdmis}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Admis</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#dc2626' }}>{bilan.nbRedoublants}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Redoublants</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Listes */}
      <div className="charts-grid" style={{ marginTop: 16 }}>
        {/* Admis */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 14 }}>
            <div className="card-icon" style={{ background: '#059669' }}>✅</div>
            <div className="card-title">Admis ({bilan.nbAdmis})</div>
          </div>
          {bilan.admis.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Aucun étudiant admis.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {bilan.admis.map((s) => (
                <div key={s.numEt} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 13px',
                  background: '#ecfdf5', borderRadius: 8,
                  border: '1px solid #a7f3d0',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{s.nom}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace' }}>{s.numEt}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>
                    {s.moyenne.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Redoublants */}
        <div className="card">
          <div className="card-header" style={{ marginBottom: 14 }}>
            <div className="card-icon" style={{ background: '#dc2626' }}>⚠️</div>
            <div className="card-title">Redoublants ({bilan.nbRedoublants})</div>
          </div>
          {bilan.redoublants.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>Aucun redoublant. 🎉</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {bilan.redoublants.map((s) => (
                <div key={s.numEt} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 13px',
                  background: '#fef2f2', borderRadius: 8,
                  border: '1px solid #fecaca',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#111827' }}>{s.nom}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.75rem', fontFamily: 'DM Mono, monospace' }}>{s.numEt}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#dc2626', fontSize: '1rem' }}>
                    {s.moyenne.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}