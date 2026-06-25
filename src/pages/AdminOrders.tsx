//@ts-ignore
import {updateOrderStatusApi} from "../api/orderApi";

type Order = {
  _id: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  user?: {
    name: string;
  };
};

function AdminOrders({orders,reloadOrders,}: {orders: Order[];reloadOrders: () => Promise<void>;}) {
  return(
    <div className="glass-panel admin-orders">
      <h2 className="orders-title">Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Method</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
        {orders.length === 0 ? (
          <tr>
            <td colSpan={3}>
              No orders found
            </td>
          </tr>
        ) : (
          orders.map((order) => (
            <tr key={order._id}>
              <td>{order.user?.name}</td>

              <td>₹{order.total}</td>
              <td>{order.paymentStatus}</td>
              <td>{order.paymentMethod}</td>
              <td>
                <select
                  aria-label="Order Status"
                  value={order.status}
                  onChange={async (e) => {
                    const token = localStorage.getItem("token");
                    if (!token) return;

                    await updateOrderStatusApi(
                      order._id,
                      e.target.value,
                      token
                    );
                    await reloadOrders();
                  }}
                >
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                </select>
              </td>
            </tr>
          ))
        )}
      </tbody>
      </table>
    </div>
  );
}

export default AdminOrders;