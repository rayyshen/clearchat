import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/initFirebase";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import './login.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/chat");
    }
  }, [user, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Context will automatically update and redirect
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div>
      <title>Login</title>
      <h1 className="Header">Log In</h1>
      <div id="rcornersbox">
      <form onSubmit={handleLogin}>
        <div>
          <label className="Label">Email <br></br></label>
          <input 
            id="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label className="Label">Password <br></br></label>
          <input 
            id="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button id="button" type="submit">Log In</button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;