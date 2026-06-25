import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Storefront from './pages/Storefront';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import Wishlist from './pages/Wishlist';
import { useAppContext } from './context/AppContext';
import Orders from './pages/Orders';
import Payment from './pages/Payment';
import Profile from './pages/Profile';

function RequireAuth({ children }: { children: JSX.Element }) {
  const {currentUser}=useAppContext();
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  const role=localStorage.getItem("role");
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/storefront" element={<RequireAuth><Storefront /></RequireAuth>} />
          <Route path="/dashboard" element={role==="admin"?<RequireAuth><Dashboard /></RequireAuth>:<Navigate to="/storefront" replace/>} />
          <Route path="/cart" element={<RequireAuth><Cart /></RequireAuth>} />
          <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>}/>
          <Route path="/admin" element={role==="admin"?<RequireAuth><AdminPanel /></RequireAuth>:<Navigate to="/storefront" replace/>} />
          <Route path="/orders" element={<RequireAuth><Orders /></RequireAuth>}></Route>
          <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>}/>
          <Route path="/profile" element={<RequireAuth><Profile/></RequireAuth>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
