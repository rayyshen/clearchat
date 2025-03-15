import React, { useState } from "react";
import type { FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/initFirebase";
import { UserProfile } from "../types/user";
import { useRouter } from "next/router";
import './signup.css';

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
    <div>
      <title>Signup</title>
      <h1 className="Header">Sign Up</h1>
      <div id="rcornersbox">
      <form onSubmit={handleSignUp} >
        <div>
          <label className="Label">Name</label>
          <input
            id="input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="Label">Email</label>
          <input
            id="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="Label">Password</label>
          <input 
            id="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button id="button" type="submit">Sign Up</button>
      </form>
      </div>
    </div>
  );
};

export default SignUpPage;