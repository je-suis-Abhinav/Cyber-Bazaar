import { useMemo } from 'react';
import { ShoppingCart, Minus, Plus, CreditCard } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PageWrapper from '../components/PageWrapper';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const { cart, products, updateCartQuantity, removeFromCart } = useAppContext();
  const navigate=useNavigate();
  const items = useMemo(
    () =>
      cart
        .map((item) => ({
          product: products.find((product) => product.id === item.productId),
          quantity: item.quantity,
        }))
        .filter((entry) => entry.product),
    [cart, products]
  );

  const total = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);

  return (
    <PageWrapper>
    <section className="cart-page">
      <div className="page-title-panel glass-panel">
        <div>
          <p className="eyebrow">Cart</p>
          <h1>Your checkout stack</h1>
          <p className="hero-copy">Review items, adjust quantities, and securely complete your order.</p>
        </div>
        <div className="cart-summary-card">
          <span>Cart total</span>
          <strong>₹{total.toFixed(2)}</strong>
          <button className="button-primary" onClick={()=>navigate('/payment')} disabled={items.length === 0}>
            <CreditCard size={18} /> Proceed to Payment
          </button>
        </div>
      </div>
      <div className="cart-details glass-panel">
        {items.length === 0 ? (
          <div className="empty-cart">
            <ShoppingCart size={48} />
            <p>Your cart is empty. Start exploring the catalog for premium components.</p>
          </div>
        ) : (
          items.map(({ product, quantity }) => (
          <div key={product?.id} className="cart-item">

            <div className="cart-item-meta">

              <img
                src={product?.image}
                alt={product?.name}
              />

              <div className="cart-item-details">

                <h3>{product?.name}</h3>

                <p>{product?.category}</p>

                <strong>₹ {product?.price.toFixed(2)}</strong>

                <p>
                  Subtotal: ₹ {(product!.price * quantity).toFixed(2)}
                </p>

              </div>

            </div>

            <div className="cart-item-controls">

              <div className="quantity-controls">

                <button
                  onClick={() =>
                    updateCartQuantity(product!.id, quantity - 1)
                  }
                >
                  <Minus size={18} />
                </button>

                <span>{quantity}</span>

                <button
                  onClick={() => {
                    if (quantity < product!.stock) {
                      updateCartQuantity(
                        product!.id,
                        quantity + 1
                      );
                    }
                  }}
                  disabled={quantity >= product!.stock}
                >
                  <Plus size={18} />
                </button>

              </div>

              <button
                className="button-secondary"
                onClick={() =>
                  removeFromCart(product!.id)
                }
              >
                Remove
              </button>

            </div>

          </div>
        ))
        )}
      </div>
    </section>
    </PageWrapper>
  );
}

export default Cart;
