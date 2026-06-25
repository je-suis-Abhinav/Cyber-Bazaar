import { useMemo,useEffect,useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AnalyticsCharts from '../components/AnalyticsCharts';
import LiveStream from '../components/LiveStream';
import PageWrapper from '../components/PageWrapper';
import DashboardSkeleton from '../components/DashboardSkeleton';
import CountUp from 'react-countup';
// @ts-ignore
import {getAllOrdersApi} from "../api/orderApi";

type Order = {
    _id: string;
    total: number;
    status: string;
    createdAt: string;
    user?: {
      _id: string;
      name: string;
    };
    paymentStatus: string;
    paymentMethod: string;
  };
function Dashboard() {    
  const {products, cart } = useAppContext();
  const [orders,setOrders]=useState<Order[]>([]);
  const totalRevenue = orders.filter(order => order.paymentStatus === "Paid").reduce((sum, order) => sum + order.total,0);
  const pendingOrders=orders.filter((o)=>o.status==="Pending").length;
  const totalCustomers = new Set(orders.map(o => o.user?._id).filter(Boolean)).size;
  const avgOrderValue=orders.length?totalRevenue/orders.length:0
  const [loading, setLoading] = useState(true);
  const lowStockProducts = products.filter((product) => product.stock > 0 && product.stock < 10);

  useEffect(() => {const fetchOrders =async () => {
    try {
      const token =localStorage.getItem("token");
      if (!token) return;
      const data =await getAllOrdersApi(token);
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
    finally{
      setLoading(false);
    }
  };
    fetchOrders();
  }, []);

  if (loading) {
    return <DashboardSkeleton />;
  }
  return (
    <PageWrapper>
    <section className="dashboard-page">
      <div className="page-title-panel glass-panel">
        <div>
          <p className="eyebrow">Insight Grid</p>
          <h1>Live analytics for your cyber storefront.</h1>
          <p className="hero-copy"> Monitor revenue, orders, customers, inventory, and live store activity in real time.</p>
        </div>
      </div>
      <div className="metrics-strip">
        <article className="metric-card glass-panel">
          <span>Total Revenue</span>
          <strong>₹{totalRevenue.toFixed(2)}</strong>
          <p>Revenue generated from completed orders</p>
        </article>
        <article className="metric-card glass-panel">
          <span>Total Orders</span>
          <strong>{orders.length}</strong>
          <p>Orders processed through the platform</p>
        </article>
        <article className="metric-card glass-panel">
          <span>Pending Orders</span>
          <strong>{pendingOrders}</strong>
          <p>Orders awaiting processing</p>
        </article>
        <article className="metric-card glass-panel pulse-card">
          <span>Total Customers</span>
          <strong>{totalCustomers}</strong>
          <p>Unique customers who placed orders</p>
        </article>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card revenue-card">
          <span>Total Revenue</span>
          <h4>₹ <CountUp end={totalRevenue} duration={2.5} separator=","/></h4>
          <p>Total revenue recorded</p>
        </div>

        <div className="analytics-card orders-card">
          <span>Orders</span>
          <h4><CountUp end={orders.length} duration={2.5} separator="," /></h4>
          <p>Total orders placed</p>
        </div>

        <div className="analytics-card users-card">
          <span>Customers</span>
          <h4><CountUp end={totalCustomers} duration={2.5} separator=","/></h4>
          <p>Unique purchasing customers</p>
        </div>

        <div className="analytics-card ai-card">
          <span>Average Order Value</span>
          <h4>₹{avgOrderValue.toFixed(0)}</h4>
          <p>Average revenue per order</p>
        </div>
      </div>
      <div className="live-ai-feed glass-panel">
          <div className="feed-header">
            <h3>Recent Orders</h3>
          </div>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            orders.slice(0,4).map((order) => (
              <div
                key={order._id}
                className="feed-item"
              >
                #{order._id.slice(-6)}
                {" • ₹"}
                {order.total}
                {" • "}
                {order.status}
              </div>
            ))
          )}
      </div>
      <div className="dashboard-grid">
        <AnalyticsCharts orders={orders}/>
        <div className="dashboard-side-panel glass-panel">
          <div className="dashboard-section">
            <h2>Low stock alert</h2>
            {lowStockProducts.length === 0 ? (
              <p>All items are well-stocked.</p>
            ) : (
              lowStockProducts.map((product) => (
                <div key={product.id} className="low-stock-row">
                  <span>{product.name}</span>
                  <strong>{product.stock} remaining</strong>
                </div>
              ))
            )}
          </div>
          <div className="dashboard-section">
            <h2>Current Cart</h2>
            <p>{cart.length} unique item{cart.length === 1 ? '' : 's'} in cart</p>
            <p>{cart.reduce((sum,item)=> sum+item.quantity,0)}
              {' '}total products selected
            </p>
          </div>
          <LiveStream />
        </div>
      </div>
    </section>
    </PageWrapper>
  );
}

export default Dashboard;
