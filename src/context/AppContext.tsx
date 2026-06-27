//@ts-ignore
import { getProducts,createProduct,updateProductApi,deleteProductApi } from '../api/productApi';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {socket} from"../socket";
//@ts-ignore
import {addToCartApi,getCart,removeFromCartApi,updateCartQuantityApi} from "../api/cartApi";
//@ts-ignore
import {getWishlistApi,addWishlistApi,removeWishlistApi,} from "../api/wishlistApi";

export type ProductCategory = 'Hardware' | 'Cybernetics' | 'Wearables' | 'Accessories';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  stock: number;
  rating: number;
  image: string;
  tags: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface AppState {
  products: Product[];
  cart: CartItem[];
  wishlist: string[];
  activePage: 'storefront' | 'dashboard' | 'cart' | 'admin';
}

type User = {
  _id: string;
  name: string;
  email: string;
  mobile:string,
  role: "admin"|"user";
};
export interface Activity {
  type: string;
  message: string;
  status?: string;
  time: string;
}

type WishlistProduct = {_id: string;};

interface AppContextValue extends AppState {
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  toggleWishlist: (productId: string) => void;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  switchPage: (page: AppContextValue['activePage']) => void;
  currentUser:any|null;
  login:(user:any)=>void;
  logout: () => void;
  loadingProducts:boolean;
  reloadCart:()=>Promise<void>;
  activities:Activity[];
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
}

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = 'cyber-bazaar-state-v1';

const usePersistedState = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          products: parsed.products || [],
          cart: parsed.cart || [],
          wishlist: parsed.wishlist || [],
          activePage: parsed.activePage || 'storefront',
        };
     }
    } catch {
      // ignore parse failures
    }
    return {
      products:[],
      cart: [],
      wishlist: [],
      activePage: 'storefront',
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return [state, setState] as const;
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = usePersistedState();
  const [loadingProducts,setLoadingProducts]= useState(true);
  const [currentUser,setCurrentUser]=useState<User|null>(()=>{
  const saved=localStorage.getItem("user");
  return saved?JSON.parse(saved):null;
  });
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("activities");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem(
        "activities",
        JSON.stringify(activities)
    );
  }, [activities]);
  useEffect(() => {
    socket.on("activity", (activity) => {
        setActivities(prev => [
            activity,
            ...prev
        ].slice(0,10));
    });
    return () => {
        socket.off("activity");
    };

}, []);
  const login=async(user:User)=>{
    setCurrentUser(user);
    await loadCart();
    await loadWishlist();
  };
  useEffect(() => {
  const fetchProducts = async () => {
    try {
      const products = await getProducts();
      setState((prev) => ({
        ...prev,
        products: products.map((p: any) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          category: p.category,
          price: p.price,
          stock: p.stock,
          rating: p.rating,
          image: p.image,
          tags: p.tags || [],
        })),
      }));
    } catch (error) {
      console.error('Failed to load products', error);
    }
    finally{
      setLoadingProducts(false);
    }
  };

  fetchProducts();
}, []);

useEffect(()=>{loadCart();},[]);
useEffect(() => {loadWishlist();}, []);
const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
    setState((prev) => ({...prev,cart: [],wishlist: [],}));
    toast('Logged out successfully', {icon: '👋',});
  };

const loadCart=async()=>{
  try{
    const token=localStorage.getItem("token");
    if(!token)
      return;
    const cartData=await getCart(token);
    if(!cartData)
      return;
    setState((prev)=>({
      ...prev,
      cart:
          cartData.items?.map((item:any)=>({
            productId:item.product._id,
            quantity:item.quantity,
          })
        )||[],
    }));
  }catch(error){
    console.error("Failed loading Cart",error);
  }
};

const loadWishlist = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;
    const data = await getWishlistApi(token);
    setState((prev) => ({...prev,
      wishlist: data.products.map((product:WishlistProduct) => product._id),
    }));
  } catch (error) {
    console.error("Failed loading wishlist", error);
  }
};

const addToCart = async (productId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    const product = state.products.find(
      (item) => item.id === productId
    );

    if (!product) return;

    await addToCartApi(productId,1,token);
    await loadCart();
    toast.success(
      `${product.name} added to cart`
    );

  } catch (error) {
    console.error(error);

    toast.error(
      "Failed to add item to cart"
    );
  }
};

const removeFromCart = async (
  productId: string
) => {
  try {

    const token =
      localStorage.getItem("token");

    if (!token) return;

    await removeFromCartApi(productId,token);
    await loadCart();

    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter(
        (item) =>
          item.productId !== productId
      ),
    }));

    toast.success(
      "Item removed from cart"
    );

  } catch (error) {

    console.error(error);

    toast.error(
      "Failed to remove item"
    );

  }
};
const updateCartQuantity = async (productId: string,quantity: number) => {
    try {
      const token =localStorage.getItem("token");
      if (!token) return;
      if (quantity <= 0) 
      {
        await removeFromCart(productId);
        return;
      }
      await updateCartQuantityApi(productId,quantity,token);
      await loadCart();
    } catch (error) 
    {
      console.error(error);
      toast.error("Failed to update quantity!");
    }
};
  
const toggleWishlist = async (productId:string) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      return;
    }
    const exists = state.wishlist.includes(productId);
    const product = state.products.find((item) => item.id === productId);
    if (exists) {
      await removeWishlistApi(productId, token);
      toast.success(`${product?.name} removed from wishlist`);
    } else {
      await addWishlistApi(productId, token);
      toast.success(`${product?.name} added to wishlist ❤️`);
    }
    await loadWishlist();
  } catch (error) {
    console.error(error);
    toast.error("Wishlist update failed");
  }
};

const addProduct = async (product: Omit<Product, 'id'>) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Login required");
          return;
        }
        const savedProduct = await createProduct(product, token);

        setState((prev) => ({
          ...prev,
          products: [
            {
              id: savedProduct._id,
              ...savedProduct,
            },
            ...prev.products,
          ],
        }));

        toast.success(`${savedProduct.name} added`);
      } catch (error) {
        console.error(error);
        toast.error("Failed to add product");
      }
  };

  const updateProduct = async (product: Product) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Login required");
      return;
    }

    const updatedProduct = await updateProductApi(product.id,product,token);
    setState((prev) => ({
      ...prev,
      products: prev.products.map((item) =>
        item.id === product.id
          ? {
              id: updatedProduct._id,
              ...updatedProduct,
            }
          : item
      ),
    }));

    toast.success(`${updatedProduct.name} updated`);
  } catch (error) {
    console.error(error);
    toast.error("Failed to update product");
  }
};

  const deleteProduct = async (productId: string) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Login required");
      return;
    }

    await deleteProductApi(productId, token);

    setState((prev) => ({
      ...prev,
      products: prev.products.filter(
        (product) => product.id !== productId
      ),
    }));

    toast.success("Product deleted");
  } catch (error) {
    console.error(error);
    toast.error("Failed to delete product");
  }
};

  const switchPage = (page: AppContextValue['activePage']) => {
    setState((prev) => ({ ...prev, activePage: page }));
  };

  const value = useMemo(
    () => ({
      ...state,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      toggleWishlist,
      addProduct,
      updateProduct,
      deleteProduct,
      currentUser,
      login,
      logout,
      switchPage,
      loadingProducts,
      reloadCart:loadCart,
      activities,
      setActivities,
    }),
    [state,currentUser,activities]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
