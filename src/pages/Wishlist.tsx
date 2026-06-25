import { useAppContext } from '../context/AppContext';
import PageWrapper from '../components/PageWrapper';


function Wishlist() {
  const {products,wishlist,toggleWishlist,addToCart,} = useAppContext();
  const wishlistProducts = products.filter((product) =>wishlist.includes(product.id));

  return (
    <PageWrapper>
      <section className="wishlist-page">
        <div className="wishlist-header glass-panel">
        <div>
          <p className="eyebrow">Saved Collection</p>
          <h1>❤️ My Wishlist</h1>
          <p className="hero-copy">
            Keep track of your favorite cyber gadgets and products.
          </p>
        </div>
      </div>

        {wishlistProducts.length === 0 ? (
          <p>Your wishlist is empty.</p>
        ) : (
          <div className="product-grid">
            {wishlistProducts.map((product) => (
              <article
                key={product.id}
                className="product-card glass-panel"
              >
                <img
                  src={product.image}
                  alt={product.name}
                />

                <h3>{product.name}</h3>

                <p>{product.description}</p>

                <div className="product-footer">
                  <button
                    className="button-secondary"
                    onClick={() =>
                      toggleWishlist(product.id)
                    }
                  >
                    Remove
                  </button>

                  <button
                    className="button-primary"
                    onClick={() =>
                      addToCart(product.id)
                    }
                  >
                    Move To Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageWrapper>
  );
}

export default Wishlist;