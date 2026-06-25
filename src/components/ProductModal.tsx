import { Product,useAppContext } from "../context/AppContext";
import "../styles/productmodal.css";

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}
export default function ProductModal({ product, onClose }: ProductModalProps) {
  const { addToCart } = useAppContext();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="product-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}> x </button>
        <div className="modal-image-section">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="modal-details">
          <span className="modal-category">{product.category}</span>
          <h2>{product.name}</h2>
          <div className="rating-row">
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
            <span>{product.rating}</span>
          </div>
          <p className="modal-description">{product.description}</p>
          <div className="tag-container">
            {product.tags.map((tag) => (
              <span key={tag} className="tag-pill">{tag}</span>
            ))}
          </div>
          <div className="stock-row">
            {product.stock > 10 ? (
              <span className="in-stock">● In Stock</span>
            ) : product.stock > 0 ? (
              <span className="low-stock">● Only {product.stock} left</span>
            ) : (
              <span className="out-stock">● Out of Stock</span>
            )}
          </div>
          <div className="price-row">₹{product.price.toFixed(2)}</div>
          <button className="modal-cart-btn" onClick={() => addToCart(product.id)} disabled={product.stock === 0}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
}