import {useAppContext } from "../context/AppContext";

function LiveStream() {
  const getActivityIcon = (type: string, status?: string) => {
  if (type === "ORDER_STATUS") {
    switch (status) {
      case "Pending":
        return "🟡";
      case "Processing":
        return "⚙️";
      case "Shipped":
        return "🚚";
      case "Delivered":
        return "✅";
      case "Cancelled":
        return "❌";
      default:
        return "📦";
    }
  }

  if (type === "ORDER_CREATED") return "🛒";
  if (type === "PRODUCT_CREATED") return "➕";
  if (type === "PRODUCT_DELETED") return "🗑️";
  if (type === "CART") return "🛍️";

  return "📢";
};

const { activities } = useAppContext();

  return (
            <div className="glass-panel">

              <h2>Live Activity Feed</h2>

              {activities.map((item, index) => (
                  <div key={`${item.time}-${index}`} className="feed-item">
                <div className="feed-header">
                  <span className="feed-icon">
                    {getActivityIcon(item.type, item.status)}
                  </span>

                  <span className="feed-title">
                    {item.message}
                  </span>
                </div>

         <span className="feed-time">
          {item.time
            ? new Date(item.time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : ""}
         </span>
        </div>
        )
      )}

    </div>
  );
}

export default LiveStream;