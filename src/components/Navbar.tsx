import { NavLink, useNavigate } from 'react-router-dom';
import {ShoppingBag,Home,BarChart3,Settings2,LogOut,Heart} from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

function Navbar() {
  const { cart, wishlist,logout,currentUser} = useAppContext();
  const user=currentUser;
  const isAdmin=user?.role==="admin";
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity,0);

  const tabs = [
    { to: '/storefront', label: 'Store', icon: Home },
    ...(isAdmin?[{to: '/dashboard', label: 'Dashboard', icon: BarChart3 }]:[]),
    { to: '/cart', label: 'Cart', icon: ShoppingBag },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/orders', label:"Orders", icon: ShoppingBag},
    ...(isAdmin?[{to:'/admin', label:'Admin',icon:Settings2}]:[]),
    { to:"/profile",label:"Profile",icon:UserCircle,},
  ] as const;

  const navigate = useNavigate();

  return (
    <header className="app-navbar glass-panel">
      <div className="brand-logo">
        <div className="brand-mark"></div>

        <div>
          <strong>Cyber Bazaar</strong>
        </div>
      </div>

      <nav className="nav-tabs">
        {user ? (
          <>
            {tabs.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive
                    ? 'nav-tab active'
                    : 'nav-tab'
                }
              >
                <Icon size={18} />

                {label}

                {to === '/cart' && itemCount > 0 ? (
                  <span className="cart-badge">
                    {itemCount}
                  </span>
                ) : null}
                {to === '/wishlist' && wishlist.length > 0 ? (
                  <span className="cart-badge">
                    {wishlist.length}
                  </span>
                ) : null}
              </NavLink>
            ))}

            <button
              className="nav-tab"
              onClick={() => {
                logout();
                navigate('/');
              }}
            >
              <LogOut size={18} />
              Logout
            </button>
          </>
        ) : (
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? 'nav-tab active'
                : 'nav-tab'
            }
          >
            <Settings2 size={18} />
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;