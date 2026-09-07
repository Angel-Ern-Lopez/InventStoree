type StatCardProps = {
    label: string
    value: string | number
    detail: string
    tone?: 'blue' | 'green' | 'amber' | 'neutral'
}

const StatCard = ({ label, value, detail, tone = 'neutral' }: StatCardProps) => {
    return (
        <article className={`dashboard-stat-card dashboard-stat-${tone}`}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>{detail}</span>
        </article>
    )
}

export default StatCard
