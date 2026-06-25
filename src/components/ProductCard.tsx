import { ShoppingBag, Eye,Heart } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import type { Product } from '../context/AppContext';

interface ProductCardProps {
  product: Product;
  onAdd: () => void;
  onView: () => void;
}

function ProductCard({ product, onAdd, onView }: ProductCardProps) {
    const { wishlist, toggleWishlist } = useAppContext();
  return (
    <article className="product-card glass-panel">
      <div className={`stock-badge ${product.stock ===0 ? 'out-stock' : product.stock<=10? 'low-stock':'in-stock'}`}>
        {product.stock ===0 ? 'Out of Stock' : product.stock<=10? 'Low Stock':'In Stock'}
      </div>
      {product.rating >= 4.8 && (<div className="trending-badge">Trending</div>)}
      <img src={product.image} alt={product.name} />
      <div className="product-copy">
        <div className="product-heading">
          <span className="product-category">{product.category}</span>
          <span className="product-price">₹ {product.price.toFixed(2)}</span>
        </div>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">

  <button
    className={`wishlist-btn ${
      wishlist.includes(product.id)
        ? 'active'
        : ''
    }`}
    onClick={() => toggleWishlist(product.id)}
  >
    <Heart
      size={18}
      fill={
        wishlist.includes(product.id)
          ? '#ff4d8d'
          : 'none'
      }
    />
  </button>

  <button
    className="button-secondary"
    onClick={onView}
  >
    <Eye size={16} /> View
  </button>

  <button
    className="button-primary"
    onClick={onAdd}
    disabled={product.stock <= 0}
  >
    <ShoppingBag size={16} />
    {product.stock > 0
      ? 'Add to cart'
      : 'Sold out'}
  </button>

</div>
      </div>
    </article>
  );
}

export default ProductCard;
