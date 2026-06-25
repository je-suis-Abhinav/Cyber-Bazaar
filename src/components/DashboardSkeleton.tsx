function DashboardSkeleton() {
  return (
    <div className="dashboard-skeleton">

      <div className="dashboard-skeleton-grid">

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="dashboard-skeleton-card skeleton"
          ></div>
        ))}

      </div>

      <div className="dashboard-skeleton-chart skeleton"></div>

      <div className="dashboard-skeleton-feed">

        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="dashboard-skeleton-item skeleton"
          ></div>
        ))}

      </div>

    </div>
  );
}

export default DashboardSkeleton;