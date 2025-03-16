import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/initFirebase";
import { UserProfile } from "../types/user";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { MessageSquareText, ArrowRight, Check, User, Mail, Lock } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    setPasswordError("");

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create/Update user profile in Firestore
      const userProfile: UserProfile = {
        name,
        email: user.email ?? "",
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", user.uid), userProfile);

      console.log("User created and profile saved:", user.uid);

      // Redirect
      router.push("/chat");
    } catch (error) {
      console.error("Sign up error:", error);
    }
  };

  const animationStyles = `
    @keyframes blob {
      0% { transform: scale(1) translate(0px, 0px); }
      33% { transform: scale(1.1) translate(30px, -50px); }
      66% { transform: scale(0.9) translate(-20px, 20px); }
      100% { transform: scale(1) translate(0px, 0px); }
    }
    .animate-blob {
      animation: blob 7s infinite;
    }
    .animation-delay-2000 {
      animation-delay: 2s;
    }
    .animation-delay-4000 {
      animation-delay: 4s;
    }
  `;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col">
      <Head>
        <title>Sign Up - ClearChat</title>
        <meta name="description" content="Create your ClearChat account and start communicating with emotional intelligence." />
        <style>{animationStyles}</style>
      </Head>

      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="text-blue-600 mr-2">
              <MessageSquareText size={28} />
            </span>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ClearChat</h1>
          </Link>
        </div>
      </header>

      <div className="flex-grow flex items-center justify-center px-4 pt-24 pb-12 relative">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-32 right-20 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-80 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>

        <div className="max-w-md w-full z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join thousands enhancing their conversations with emotional context</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 hover:shadow-2xl">
            <div className="absolute -top-2 left-8 w-16 h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 rounded"></div>

            <form onSubmit={handleSignUp} className="space-y-5">
              <div>
                <label className="text-gray-700 font-medium mb-1 block flex items-center">
                  <User size={16} className="mr-2 text-blue-500" />
                  Full Name
                </label>
                <input
                  className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200 focus:outline-none"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium mb-1 block flex items-center">
                  <Mail size={16} className="mr-2 text-blue-500" />
                  Email Address
                </label>
                <input
                  className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200 focus:outline-none"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-gray-700 font-medium mb-1 block flex items-center">
                  <Lock size={16} className="mr-2 text-blue-500" />
                  Password
                </label>
                <input
                  className="w-full p-3 text-gray-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition duration-200 focus:outline-none"
                  type="password"
                  placeholder="Create a secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>

              <button
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                type="submit"
              >
                Create Account <ArrowRight size={18} className="ml-2" />
              </button>

              <div className="pt-4 text-center text-gray-600">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200">
                  Log in instead
                </Link>
              </div>
            </form>
          </div>

        </div>
      </div>

      <footer className="bg-white py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-blue-600 mr-2">
                <MessageSquareText size={20} />
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">ClearChat</span>
            </div>
            <div className="mt-4 md:mt-0 text-sm text-gray-500">
              © 2025 ClearChat. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SignUpPage;