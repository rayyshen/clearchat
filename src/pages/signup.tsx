import React, { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/initFirebase";
import { UserProfile } from "../types/user";
import { useRouter } from "next/router";
import Link from "next/link";

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: FormEvent) => {
    console.log(email, name);
    e.preventDefault();

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

  return (
    <div className="min-h-screen bg-gray-100 text-white p-10">
      <title>Signup</title>
      <h1 className="text-3xl text-black text-center p-2.5">Sign Up</h1>
      <div className="mx-auto rounded-2xl border-2 shadow-xl bg-white p-5 w-[500px] h-[385px]">
        <form onSubmit={handleSignUp}>
          <div>
            <label className="text-black text-center block">Name</label>
            <input
              className="text-black w-full p-2.5 text-base rounded border-2 border-gray-100 my-1.5 block"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            Sign Up
          </button>

          <text className="text-black w-full p-2.5 text-center block">Already have an account?&nbsp;
          <Link href="/login" className="text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200 text-black w-full">
          Log in
          </Link>
          </text>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;