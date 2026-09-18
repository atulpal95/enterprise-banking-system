function StatCard({
    title,
    value,
    icon: Icon,
    color = "#2563eb"
}) {

    return (

        <div className="stat-card">

            <div className="stat-content">

                <span className="stat-title">
                    {title}
                </span>

                <h2 className="stat-value">
                    {value}
                </h2>

            </div>

            <div
                className="stat-icon"
                style={{ backgroundColor: color }}
            >
                <Icon size={22} />
            </div>

        </div>

    );

}

export default StatCard;