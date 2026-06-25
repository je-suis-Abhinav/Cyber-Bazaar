import {useState,useEffect } from 'react';
import { PlusCircle, Trash2, Edit3 } from 'lucide-react';
import { useAppContext, Product } from '../context/AppContext';
import PageWrapper from '../components/PageWrapper';
import AdminOrders from './AdminOrders';
//@ts-ignore
import {uploadImageApi} from '../api/uploadApi';
//@ts-ignore
import { getAllOrdersApi} from '../api/orderApi';

type Order = {
  _id: string;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  items: any[];
};

const initialFormState = {
  name: '',
  description: '',
  category: 'Hardware',
  price: 0,
  stock: 0,
  rating: 4.5,
  image: '',
};

function AdminPanel() {
  const { products, addProduct, updateProduct, deleteProduct} = useAppContext();
  const [formState, setFormState] = useState(initialFormState);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [orders,setOrders]=useState<Order[]>([]);
  const [selectedImage,setSelectedImage]=useState<File|null>(null);
  const loadOrders = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) return;

    const data = await getAllOrdersApi(token);

    setOrders(data);
  } catch (error) {
    console.error(error);
  }
};
useEffect(() => {
  loadOrders();
}, []);
  const handleSubmit = async(event: React.FormEvent) => {
    event.preventDefault();
    let imageUrl=formState.image;
    if(selectedImage){
      const token=localStorage.getItem("token");
      if(!token) return;
      imageUrl=await uploadImageApi(selectedImage,token);
    }
    const payload = {
      name: formState.name,
      description: formState.description,
      category: formState.category as Product['category'],
      price: Number(formState.price),
      stock: Number(formState.stock),
      rating: Number(formState.rating),
      image: imageUrl,
      tags: ['new', 'admin', 'smart'],
    };

    if (editItemId) {
      await updateProduct({ ...payload, id: editItemId });
      setEditItemId(null);
    } else {
      const existingProduct = products.find(
        (product) =>
          product.name.toLowerCase().trim() ===
          payload.name.toLowerCase().trim()
      );

      if (existingProduct) {
        await updateProduct({
          ...payload,
          id: existingProduct.id,
        });
      } else {
        await addProduct(payload);
      }
}
    setFormState(initialFormState);
    setSelectedImage(null);
  };

const totalOrders = orders.length;
const revenue = orders.filter(order => order.paymentStatus === "Paid")
    .reduce((sum, order) => sum + order.total,0);
  
return (
    <PageWrapper>
    <section className="admin-page">
      <div className="page-title-panel glass-panel">
        <div>
          <p className="eyebrow">Administrative Control</p>
          <h1>Manage products, stock, and order flow.</h1>
          <p className="hero-copy">Update catalog items, add new inventory, and review order history with instant insights.</p>
        </div>
      </div>
      <div className="metrics-strip">
      <article className="metric-card glass-panel">
        <span>Products</span>
        <strong>{products.length}</strong>
      </article>

      <article className="metric-card glass-panel">
        <span>Orders</span>
        <strong>{totalOrders}</strong>
      </article>

      <article className="metric-card glass-panel">
        <span>Revenue</span>
        <strong>₹{revenue.toFixed(0)}</strong>
      </article>

      <article className="metric-card glass-panel">
        <span>Low Stock</span>
        <strong>
          {products.filter(p => p.stock < 10).length}
        </strong>
      </article>
    </div>
      <div className="admin-layout">

  
        <div className="admin-left">

          <div className="admin-panel-left glass-panel">
            <div className="product-table">
              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className={product.stock < 10 ? "low-stock" : ""}
                    >
                      <td>{product.name}</td>
                      <td>{product.category}</td>
                      <td>₹{product.price.toFixed(2)}</td>
                      <td>{product.stock} left</td>

                      <td className="row-actions">
                        <button
                          className="icon-button"
                          onClick={() => {
                            setEditItemId(product.id);

                            setFormState({
                              name: product.name,
                              description: product.description,
                              category: product.category,
                              price: product.price,
                              stock: product.stock,
                              rating: product.rating,
                              image: product.image,
                            });
                          }}
                        >
                          <Edit3 size={80} strokeWidth={4} />
                        </button>

                        <button
                          className="icon-button"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 size={80} strokeWidth={4} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <AdminOrders
            orders={orders}
            reloadOrders={loadOrders}
          />

        </div>

        {/* RIGHT COLUMN */}
        <div className="admin-right">

          <aside className="admin-panel-right glass-panel">

            <div className="admin-form-card">
              <div className="section-header">
                <p className="eyebrow">Management</p>

                <h2>
                  {editItemId ? "Edit Product" : "Add Product"}
                </h2>
              </div>

              <form onSubmit={handleSubmit}>
                <label id="name"> Name <input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} required /> </label> 
                <label id="category"> Category <select value={formState.category} onChange={(e) => setFormState({ ...formState, category: e.target.value })}> 
                  <option>Hardware</option> 
                  <option>Cybernetics</option> 
                  <option>Wearables</option> 
                  <option>Accessories</option> 
                  </select></label> 
                <label id="price"> Price <input type="number" value={formState.price} onChange={(e) => setFormState({ ...formState, price: Number(e.target.value) })} required /> </label> 
                <label id="stock"> Stock <input type="number" value={formState.stock} onChange={(e) => setFormState({ ...formState, stock: Number(e.target.value) })} required /> </label> 
                <label>Product Image <input type="file" accept="image/*" onChange={(e) => { if (e.target.files) { setSelectedImage(e.target.files[0]); } }} /> 
                {selectedImage && formState.image && ( <img src={formState.image} alt="Current Product" style={{ width: "100%", maxHeight: "180px", objectFit: "cover", borderRadius: "12px", marginTop: "10px", }} /> )} </label> 
                <label id="description"> Description <textarea value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} rows={4} required /> </label> 
                <button type="submit" className="button-primary"> <PlusCircle size={18} /> {editItemId ? 'Update item' : 'Create item'} </button>
              </form>
            </div>

            <div className="orders-feed">
              <h2>Recent Order History</h2>

              {orders.slice(0, 6).map((order) => (
                <div
                  key={order._id}
                  className="order-card"
                >

                  <div className="order-top">
                    <div>
                      <strong>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </strong>
                      <div>#{order._id.slice(-6)}</div>
                    </div>

                    <span className="order-status">
                      {order.status}
                    </span>
                  </div>

                  <div className="order-middle">
                    <div>
                      {order.items.length} item{order.items.length > 1 ? "s" : ""} • ₹{order.total}
                    </div>

                    <span className="payment-status">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="payment-method">
                    {order.paymentMethod}
                  </div>

                </div>
              ))}
            </div>

          </aside>

        </div>

      </div>
      </section>
    </PageWrapper>
  );
}

export default AdminPanel;
