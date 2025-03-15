import React, { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/initFirebase";
import { UserProfile } from "../types/user";
import { useRouter } from "next/router";

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
    <div className="min-h-screen bg-[#282c34] text-white p-10">
      <title>Signup</title>
      <h1 className="text-3xl text-white text-center p-2.5">Sign Up</h1>
      <div className="mx-auto rounded-2xl border-2 border-[#494a4b] bg-white p-5 w-[500px] h-[350px]">
        <form onSubmit={handleSignUp}>
          <div>
            <label className="text-black text-center block">Name</label>
            <input
              className="text-black w-full p-2.5 text-base rounded border-2 border-[#494a4b] my-1.5 block"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-black text-center block">Email</label>
            <input
              className="text-black w-full p-2.5 text-base rounded border-2 border-[#494a4b] my-1.5 block"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-black text-center block">Password</label>
            <input 
              className="text-black w-full p-2.5 text-base rounded border-2 border-[#494a4b] my-1.5 block"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            className="text-black w-full p-2.5 text-base rounded bg-[deepskyblue] my-2.5 block"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;