//@ts-ignore
import {registerApi,loginApi} from "../api/authApi";
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from "../context/AppContext";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [captchaQ, setCaptchaQ] = useState('');
  const [captchaA, setCaptchaA] = useState<number | null>(null);
  const [captchaInput, setCaptchaInput] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const {login}=useAppContext();
  useEffect(() => {
    if (mode === 'signup' && !captchaQ) 
    { genCaptcha();
    }}, [mode, captchaQ]);

  const genCaptcha = () => {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    setCaptchaQ(`What is ${a} + ${b}?`);
    setCaptchaA(a + b);
    setCaptchaInput('');
  };

  const handleSubmit = async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setInfo(null);
    if (mode === 'signup') 
    {
      if (!name.trim()) 
      {
        setError('Please enter your name');
        return;
      }
      if (password.length < 6) 
      {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) 
      {
        setError('Passwords do not match');
        return;
      }
      if (mobile && !/^\d{10}$/.test(mobile)) {
        setError("Mobile number must contain 10 digits");
        return;
      }
      if (captchaA === null || Number(captchaInput) !== captchaA) 
      {
        setError('Captcha verification failed');
        genCaptcha();
        return;
      }

      //sign-up
      try{
        await registerApi({
          name: name.trim(),
          email: email.trim(),
          password,
          mobile:mobile.trim(),
        });
        setInfo("Registration Successful-Please Login");
        setMode("signin");
        setPassword("");
        setConfirmPassword("");
        setCaptchaInput("");
        setCaptchaQ("");
        setCaptchaA(null);
        setTimeout(()=>emailRef.current?.focus(),60);
      }catch(error:any){
        setError(error?.response?.data?.message || "Registration failed!");
      }
      return;
    }
    // signin
    try{
      const data=await loginApi(email.trim(),password);
      localStorage.setItem("token",data.token);
      localStorage.setItem("role",data.user.role);
      localStorage.setItem("user",JSON.stringify(data.user));
      login(data.user)
      navigate("/storefront");
    }
    catch(error:any){
      setError(error?.response?.data?.message || "Invalid Email or Password!");
    }
  };

  return (
    <section className="login-page">
      <div className="login-card">
        <h1>{mode === 'signin' ? 'Login' : 'Sign Up'}</h1>
        <p>{mode === 'signin' ? 'Sign in to manage your storefront, orders, and analytics in one place!' : 'Create an account to get started with your cyber storefront.'}</p>

        <form className="login-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Full name
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              ref={emailRef}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
            />
          </label>

          {mode === 'signup' && (
            <>
              <label>
                Confirm password
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" minLength={6} required />
              </label>

              <label>
                Mobile number
                <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="Mobile number" />
              </label>

              <label>
                Captcha: {captchaQ || ''}
                <input type="text" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} placeholder="Answer" aria-label="captcha answer" required />
              </label>
            </>
          )}

          <button type="submit" className="button-primary">
            {mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="login-form-actions">
          <button
            className="button-secondary"
            onClick={() => {
              const next = mode === 'signin' ? 'signup' : 'signin';
              setMode(next);
              setError(null);
              setInfo(null);
              setEmail('');
              setPassword('');
              setConfirmPassword('');
              setMobile('');
              setName('');
              genCaptcha();
            }}
          >
            {mode === 'signin' ? 'Need an account?' : 'Already registered?'}
          </button>
        </div>
        {error && <p className="login-message error">{error}</p>}
        {info && <p className="login-message info">{info}</p>}
      </div>
    </section>
  );
}
export default Login;

