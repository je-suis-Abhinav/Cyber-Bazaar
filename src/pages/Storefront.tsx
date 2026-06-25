import {useMemo, useState } from 'react';
import { Search,Heart} from 'lucide-react';
import { useAppContext, Product } from '../context/AppContext';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import PageWrapper from '../components/PageWrapper';
import SkeletonCard from '../components/SkeletonCard';
import { useNavigate } from 'react-router-dom';

const categories = ['All', 'Hardware', 'Cybernetics', 'Wearables', 'Accessories'] as const;

function Storefront() {
  const {currentUser,products, addToCart,loadingProducts} = useAppContext();
  const [search, setSearch] = useState('');
  const navigate=useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<typeof categories[number]>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const searchTerm = search.toLowerCase();
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesCategory;
      }),
    [products, search, selectedCategory]
  );
  const handleViewDetails = (product: Product) => {setSelectedProduct(product);};

  return (
    <PageWrapper>
    <section className="storefront-page">
      <div className="hero-panel glass-panel">
      <div className="hero-content">
      <div className="hero-left">
        <p className="eyebrow">NEXT GEN COMMERCE</p>
        <h1>The Future of<span> Cyber Shopping</span></h1>
        <p className="hero-copy">Explore futuristic gadgets, neural wearables, AI-powered accessories, and immersive cyber tech.</p>
          <div className="hero-buttons">
           <button className="button-primary"
                  onClick={() => {document.getElementById('products-section')?.scrollIntoView({ behavior: 'smooth' });}}>Explore Store</button>
           {currentUser?.role === "admin" ? (
              <button
                className="button-secondary"
                onClick={() => navigate("/dashboard")}
              >
                View Analytics
              </button>
            ) : (
              <button
                className="button-secondary hero-wishlist-btn"
                onClick={() => navigate("/wishlist")}
              >
                <Heart size={18} />Explore Wishlist
              </button>
            )}
          </div>
      </div>
      <div className="hero-right">
      <div className="hero-stat glass-panel">
        <h2>{products.length}</h2>
        <span>Products</span>
      </div>
      <div className="hero-stat glass-panel">
        <h2>{products.length? (products.reduce((sum,p)=>sum+p.rating,0) / products.length).toFixed(1): "0.0"}★</h2>
        <span>User Rating</span>
      </div>
      <div className="hero-stat glass-panel">
        <h2>24/7</h2>
        <span>Live Support</span>
          </div>
        </div>
      </div>
    </div>

      <div className="storefront-toolbar glass-panel">
        <div className="search-field">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search products, features, or tags"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={selectedCategory === category ? 'filter-pill active' : 'filter-pill'}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

     <div id="products-section" className="product-grid">
        {loadingProducts ? (
          Array.from({ length: 8 }).map((_, index) => (<SkeletonCard key={index}/>))
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addToCart(product.id)}
              onView={() => handleViewDetails(product)}
            />
          ))
        )}
      </div>
      {!loadingProducts &&filteredProducts.length === 0 && (
        <div className="glass-panel">
          <h3>No products found</h3>
          <p>
            Try a different search term or category.
          </p>
        </div>
      )}
      {selectedProduct && (
        <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}/>
      )}
    </section>
    </PageWrapper>
  );
}

export default Storefront;
