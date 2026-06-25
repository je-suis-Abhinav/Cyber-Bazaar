function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton skeleton-category"></div>
        <div className="skeleton skeleton-title"></div>
        <div className="skeleton skeleton-description"></div>
        <div className="skeleton-footer">
          <div className="skeleton skeleton-button"></div>
          <div className="skeleton skeleton-button"></div>
        </div>
      </div>
    </div>
  );
}

export default SkeletonCard;