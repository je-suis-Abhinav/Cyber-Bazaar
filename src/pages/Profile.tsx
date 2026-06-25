import PageWrapper from "../components/PageWrapper";
import { useAppContext } from "../context/AppContext";
import "../styles/profile.css";
import { useState,useEffect } from "react";
//@ts-ignore
import { getMyOrdersApi } from "../api/orderApi";

function Profile() {
    const [orders, setOrders] = useState([]);
    useEffect(() => {
    const loadOrders = async () => {
        try{
            const token = localStorage.getItem("token");
            if(!token) return;
            const data = await getMyOrdersApi(token);
            setOrders(data);
        }
        catch(err){
            console.error(err);
        }
    };

    loadOrders();

},[]);
    const {
        currentUser,
        wishlist,
        cart,
        logout,
    } = useAppContext();

    return (
        <PageWrapper>

        <section className="profile-page">

            <div className="glass-panel profile-card">

                <div className="profile-avatar">

                    {currentUser?.name.charAt(0).toUpperCase()}

                </div>

                <h2>{currentUser?.name}</h2>

                <p>{currentUser?.email}</p>

            </div>

            <div className="glass-panel profile-info">

                <h3>Account Details</h3>

                <div className="profile-row">
                    <span>Name</span>
                    <strong>{currentUser?.name}</strong>
                </div>

                <div className="profile-row">
                    <span>Email</span>
                    <strong>{currentUser?.email}</strong>
                </div>

                <div className="profile-row">
                    <span>Mobile</span>
                    <strong>{currentUser?.mobile}</strong>
                </div>

                <div className="profile-row">
                    <span>Role</span>
                    <strong>{currentUser?.role}</strong>
                </div>

            </div>

            <div className="profile-stats">

                <div className="glass-panel stat-card">
                    <h2>{orders.length}</h2>
                    <span>Orders</span>
                </div>

                <div className="glass-panel stat-card">
                    <h2>{wishlist.length}</h2>
                    <span>Wishlist</span>
                </div>

                <div className="glass-panel stat-card">
                    <h2>{cart.length}</h2>
                    <span>Cart</span>
                </div>

            </div>

            <div className="glass-panel profile-actions">

                <button className="button-secondary">
                    Change Password
                </button>

                <button
                    className="button-primary"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </section>

        </PageWrapper>
    );
}

export default Profile;