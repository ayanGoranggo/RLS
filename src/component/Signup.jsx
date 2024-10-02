import React, { useState } from "react";
import { supabase } from "../supabaseClient";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(true); // Toggle between signup and login

  const handleAuth = async () => {
    let response; // Define a variable to hold the response
    if (isSignup) {
      // Signup
      response = await supabase.auth.signUp({ email, password });
    } else {
      // Login
      response = await supabase.auth.signInWithPassword({ email, password });
    }

    // Check for an error in the response
    const { error } = response; // Now destructure the error from the response

    if (error) {
      console.log("Authentication error:", error.message);
    } else {
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div>
      <h2>{isSignup ? "Sign Up" : "Login"}</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={handleAuth}>{isSignup ? "Sign Up" : "Login"}</button>
      <button onClick={() => setIsSignup(!isSignup)}>
        Switch to {isSignup ? "Login" : "Sign Up"}
      </button>
    </div>
  );
};

export default Signup;
