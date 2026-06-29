import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "../components/PageWrapper";
import { useAppContext } from "../context/AppContext";
import "../styles/payment.css";
import toast from "react-hot-toast";
//@ts-ignore
import { createOrderApi } from "../api/orderApi";
import {CreditCard,Smartphone,Building2,Wallet,} from "lucide-react";
import confetti from "canvas-confetti";

function Payment() {
  const { cart,products,reloadCart,reloadProducts } = useAppContext();
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [bank, setBank] = useState("SBI");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [upiId,setUpiId]=useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (cart.length === 0) {
        navigate("/cart");
    }
    }, [cart, navigate]);
    const launchConfetti = () => {
        const duration = 3000;
        const animationEnd = Date.now() + duration;

        const defaults = {
            startVelocity: 35,
            spread: 360,
            ticks: 80,
            zIndex: 9999,
        };

        const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
            clearInterval(interval);
            return;
            }

            confetti({
            ...defaults,
            particleCount: 3,
            origin: {
                x: Math.random(),
                y: Math.random() * 0.4,
            },
            });
        }, 120);
    };
  const items = cart.map((item) => ({
    product: products.find((p) => p.id === item.productId),
    quantity: item.quantity,
  }))
  .filter((item) => item.product);
  const total = items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity,0);
  const deliveryCharge =paymentMethod === "Cash On Delivery"? 50: 0;
  const gst = total * 0.18;
  const grandTotal = total + gst + deliveryCharge;
  const handlePayment = async () => {
    if (paymentMethod === "Credit Card" ||paymentMethod === "Debit Card" ) {
        if(name.trim().length<3){
            toast.error("Enter card holder name.");
            return;
        }

        if(!/^\d{16}$/.test(cardNumber)){
            toast.error("Card number must contain 16 digits.");
            return;
        }

        if(!/^\d{3}$/.test(cvv)){
            toast.error("Invalid CVV.");
            return;
        }

        if(!/^\d{2}\/\d{2}$/.test(expiry)){
            toast.error("Expiry must be MM/YY.");
            return;
        }
    }
    if (paymentMethod === "UPI") {
        if (!/^[\w.-]+@[\w]+$/.test(upiId)) {
            toast.error("Enter a valid UPI ID.");
            return;
        }
    }
    try {
      setLoading(true);
      await new Promise(resolve =>setTimeout(resolve, 2500));
      const token = localStorage.getItem("token");
      if (!token) return;
      await createOrderApi(
        {
          paymentStatus: paymentMethod === "Cash On Delivery"? "Pending": "Paid",
          paymentMethod: paymentMethod,
          bank:paymentMethod==="Net Banking"?bank:"",
          transactionId: paymentMethod === "Cash On Delivery"? "": "CB-" + Date.now(),
        },
        token
      );
      await reloadCart();
      await reloadProducts();
      if(paymentMethod==="Cash On Delivery"){
        launchConfetti();
        toast.success("Order placed successfully!📦");
      }
      else{
        launchConfetti();
        toast.success("Payment Successful!🎉");
      }
        setName("");
        setCardNumber("");
        setExpiry("");
        setCvv("");
        setUpiId("");
        setBank("SBI");
        setPaymentMethod("Credit Card");
      setTimeout(() => {navigate("/orders");}, 2500);
    } catch (err) {
      console.error(err);
      toast.error("Payment Failed.");
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <PageWrapper>
    <section className="payment-page">
        <div className="payment-layout">
        <div className="payment-card glass-panel">

        <div className="payment-header">
            <h1>Secure Checkout</h1>
            <p>Complete your payment securely.</p>
        </div>

        <div className="payment-total">
            <span>Total Amount</span>
            <strong>₹{grandTotal.toFixed(2)}</strong>
        </div>
        <div className="payment-methods">
        <button
            className={
                paymentMethod==="Credit Card"
                ?"payment-option active"
                :"payment-option"
            }
            onClick={()=>setPaymentMethod("Credit Card")}>
            <CreditCard size={18} /><span>Credit Card</span>
        </button>

        <button
            className={
                paymentMethod==="Debit Card"
                ?"payment-option active"
                :"payment-option"
            }
            onClick={()=>setPaymentMethod("Debit Card")}
        >
            <CreditCard size={18} /><span>Debit Card</span>
        </button>

        <button
            className={
                paymentMethod==="Net Banking"
                ?"payment-option active"
                :"payment-option"
            }
            onClick={()=>setPaymentMethod("Net Banking")}
        >
            <Building2 size={18} /><span>Net Banking</span>
        </button>

        <button
            className={
                paymentMethod==="UPI"
                ?"payment-option active"
                :"payment-option"
            }
            onClick={()=>setPaymentMethod("UPI")}
        >
            <Smartphone size={18} /><span>UPI</span>
        </button>

        <button
            className={
                paymentMethod==="Cash On Delivery"
                ?"payment-option active"
                :"payment-option"
            }
            onClick={()=>setPaymentMethod("Cash On Delivery")}
        >
            <Wallet size={18} /><span>Cash On Delivery</span>
        </button>
        </div>
        
        {(paymentMethod==="Credit Card" || paymentMethod==="Debit Card") && (
            <>
        <label>
            Card Holder Name
            <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            placeholder="John Doe"
            />
        </label>

        <label>
            Card Number
            <input
            value={cardNumber}
            maxLength={16}
            onChange={(e)=>setCardNumber(e.target.value)}
            placeholder="1234567812345678"
            />
        </label>

        <div className="payment-row">

            <label>
            Expiry
            <input
                value={expiry}
                onChange={(e)=>setExpiry(e.target.value)}
                placeholder="MM/YY"
            />
            </label>

            <label>
            CVV
            <input
                value={cvv}
                maxLength={3}
                onChange={(e)=>setCvv(e.target.value)}
                placeholder="123"
            />
            </label>

        </div>
        </>
        )}
        {paymentMethod==="UPI" && (
            <label>UPI ID
            <input value={upiId} onChange={(e) => setUpiId(e.target.value)} placeholder="yourname@upi"/>
            </label>
        )}
        {paymentMethod==="Net Banking" && (
            <label>Select Bank
            <select value={bank} onChange={(e)=>setBank(e.target.value)}>
                <option>SBI</option>
                <option>HDFC</option>
                <option>ICICI</option>
                <option>Axis Bank</option>
                <option>PNB</option>
                <option>Kotak</option>
                <option>IDFC First</option>
                <option>Indian Bank</option>
            </select>
            </label>
        )}
        {paymentMethod==="Cash On Delivery" && (
            <div className="cod-box">
            <h3>Cash on Delivery</h3>
            <p>Pay when your order is delivered. A handling fee of ₹50 may apply.</p>
            </div>
        )}
        
        <button
            className="button-primary payment-btn"
            disabled={loading || total === 0}
            onClick={handlePayment}
        >
            {loading ? (
                <>
                    <span className="loader"></span>
                    Processing Payment...
                </>
            ) : (
                paymentMethod==="Cash On Delivery"
                ? "Place Order"
                : `Pay ₹${grandTotal.toFixed(2)}`
            )}
        </button>

        <button
            className="button-secondary"
            onClick={()=>navigate("/cart")}
        >
            Cancel Payment
        </button>

        </div>
        <div className="payment-sidebar glass-panel">

            <h2>Order Summary</h2>

            <div className="summary-row">
                <span>Items</span>
                <span>{cart.length}</span>
            </div>

            <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
            </div>

            <div className="summary-row">
                <span>Delivery</span>

                <span>
                    {paymentMethod === "Cash On Delivery"
                        ? "₹50"
                        : "FREE"}
                </span>
            </div>

            <div className="summary-row">
                <span>GST (18%)</span>
                <span>₹{(total).toFixed(2)}</span>
            </div>

            <hr />

            <div className="summary-row grand-total">
                <strong>Grand Total</strong>

                <strong>
                    ₹{(total*1.18 +(paymentMethod === "Cash On Delivery"? 50: 0)).toFixed(2)}
                </strong>

            </div>

        </div>

    </div>

</section>
    </PageWrapper>
  );
}

export default Payment;