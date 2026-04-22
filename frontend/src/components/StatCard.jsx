export default function StatCard({ icon, value, label, suffix = '', color = 'purple' }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-value">
        {typeof value === 'number' ? value.toFixed(1) : value}
        {suffix}
      </div>
      <div className="stat-label">{label}</div>
    </div>
  )
}