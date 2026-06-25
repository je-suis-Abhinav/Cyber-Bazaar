import type { Product, ProductCategory, LogEvent } from '../context/AppContext';

const categories: ProductCategory[] = ['Hardware', 'Cybernetics', 'Wearables', 'Accessories'];

const products: Product[] = [
  {
    id: 'prod-001',
    name: 'Neural Interface VR',
    description: 'Immersive neural feedback headset with adaptive AR overlays and biometric tuning.',
    category: 'Hardware',
    price: 549.0,
    stock: 12,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    tags: ['immersive', 'AR', 'next-gen'],
  },
  {
    id: 'prod-002',
    name: 'Holographic Projector',
    description: 'Portable holo-generator with crisp lightfield rendering and voice-activated controls.',
    category: 'Hardware',
    price: 349.0,
    stock: 8,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    tags: ['holo', 'portable', 'visual'],
  },
  {
    id: 'prod-003',
    name: 'Synaptic Wristband',
    description: 'Wearable neural hub for biometric optimization, pulse control, and adaptive comfort.',
    category: 'Wearables',
    price: 179.0,
    stock: 24,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=800&q=80',
    tags: ['wearable', 'health', 'AI'],
  },
  {
    id: 'prod-004',
    name: 'Cybernetic Optics Lens',
    description: 'Augmented vision lens with thermal scan, low-light enhancement, and biometric interface.',
    category: 'Cybernetics',
    price: 799.0,
    stock: 5,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=800&q=80',
    tags: ['vision', 'AR', 'bio'],
  },
  {
    id: 'prod-005',
    name: 'Tactical Smart Jacket',
    description: 'High-tech jacket with reactive temperature control and integrated HUD connectivity.',
    category: 'Wearables',
    price: 269.0,
    stock: 14,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80',
    tags: ['smart', 'thermal', 'fashion'],
  },
  {
    id: 'prod-006',
    name: 'Quantum Data Module',
    description: 'Secure data cartridge with quantum-state encryption and offline transfer safeguards.',
    category: 'Accessories',
    price: 129.0,
    stock: 30,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1581091166040-9e30b70c4b28?auto=format&fit=crop&w=800&q=80',
    tags: ['secure', 'data', 'quantum'],
  },
];

const logs: LogEvent[] = [
  {
    id: 'log-001',
    type: 'PRODUCT_VIEW',
    message: 'Launched analytics engine and loaded dashboard.',
    createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  },
  {
    id: 'log-002',
    type: 'ADD_TO_CART',
    message: 'User added Holographic Projector to cart.',
    metadata: { productId: 'prod-002' },
    createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'log-003',
    type: 'CHECKOUT_COMPLETE',
    message: 'Completed purchase for Neural Interface VR.',
    metadata: { total: 549 },
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
];

const liveEvents = [
  { type: 'PRODUCT_VIEW' as const, message: 'Tokyo visitor viewed Cybernetic Optics Lens.', metadata: { productId: 'prod-004' } },
  { type: 'ADD_TO_CART' as const, message: 'Cart updated with a Synaptic Wristband.', metadata: { productId: 'prod-003', price: 179 } },
  { type: 'CART_ABANDON' as const, message: 'Cart abandoned worth ₹249.99.', metadata: { value: 249.99 } },
  { type: 'CHECKOUT_START' as const, message: 'Checkout started for a Tactical Smart Jacket.', metadata: { productId: 'prod-005' } },
  { type: 'CHECKOUT_COMPLETE' as const, message: 'Customer completed purchase for a Quantum Data Module.', metadata: { total: 129 } },
];

export default { products, logs, liveEvents, categories };
