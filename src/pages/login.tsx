import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/initFirebase";
import { useRouter } from "next/router";
import { useUser } from "../context/UserContext";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-100 text-white p-10">
      <title>Login</title>
      <h1 className="text-3xl text-black text-center p-2.5">Log In</h1>
      <div className="mx-auto rounded-2xl border-2 shadow-xl bg-white p-5 w-[500px] h-[300px]">
        <form onSubmit={handleLogin}>
          <div>
            <label className="text-black text-center block">Email</label>
            <input 
              className="text-black w-full p-2.5 text-base rounded border-2 border-gray-100 my-1.5 block"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div>
            <label className="text-black text-center block">Password</label>
            <input 
              className="text-black w-full p-2.5 text-base rounded border-2 border-gray-100 my-1.5 block"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            className="text-white w-full p-2.5 text-base rounded bg-blue-500 hover:bg-blue-600 transition-colors duration-200 my-2.5 block"
            type="submit"
          >
            Log In
          </button>
          <text className="text-black w-full p-2.5 text-center block">Don't have an account?&nbsp;
          <Link href="/signup" className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-black w-full">
          Sign Up
          </Link>
          </text>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;