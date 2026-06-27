//@ts-ignore
import { getMyOrdersApi } from "../api/orderApi";
import { useEffect, useState } from "react";
import PageWrapper from "../components/PageWrapper";
import "../styles/orders.css";

type OrderItem = {
  _id:string;
  quantity: number;
  product: string;
  name: string;
  image: string;
  price: number;
};

type Order = {
  _id: string;
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  items: OrderItem[];
};

function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const data = await getMyOrdersApi(token);

        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <PageWrapper>
        <p>Loading orders...</p>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <section className="orders-page">

        <div className="page-title-panel glass-panel">
          <p className="eyebrow">Purchase History</p>

          <h1>Your Orders</h1>

          <p className="hero-copy">
            Track your purchases, payments and deliveries in one place.
          </p>
        </div>

        <div className="orders-grid">

          {orders.length === 0 ? (
            <div className="glass-panel">
              <p>No orders found.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="order-history-card"
              >

                {/* ---------- TOP ---------- */}

                <div className="order-history-top">

                  <div>
                    <h3>
                      Order #{order._id.slice(-6)}
                    </h3>

                    <span>
                      {new Date(
                        order.createdAt
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="order-badges">

                    <span
                      className={`status-badge ${order.status.toLowerCase()}`}
                    >
                      {order.status}
                    </span>

                    <span
                      className={`payment-badge ${order.paymentStatus.toLowerCase()}`}
                    >
                      {order.paymentStatus}
                    </span>

                  </div>

                </div>

                {/* ---------- DETAILS ---------- */}

                <div className="order-history-body">

                  <div className="order-detail">

                    <label>Total</label>

                    <strong>
                      ₹{order.total.toFixed(2)}
                    </strong>

                  </div>

                  <div className="order-detail">

                    <label>Payment</label>

                    <span>
                      {order.paymentMethod}
                    </span>

                  </div>

                  <div className="order-detail">

                    <label>Transaction</label>

                    <span>
                      {order.transactionId || "--"}
                    </span>

                  </div>

                </div>

                {/* ---------- ITEMS ---------- */}

                <div className="order-items">

                  <h4>Items Ordered</h4>

                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="order-item-row"
                    >

                      <span>
                        {item.name}
                      </span>

                      <strong>
                        × {item.quantity}
                      </strong>

                    </div>
                  ))}

                </div>

              </div>
            ))
          )}

        </div>

      </section>
    </PageWrapper>
  );
}

export default Orders;