import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Signup from "./component/Signup";
import Dashboard from "./component/Dashboard";
const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    const session = supabase.auth.getSession();
    setSession(session);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  return <div>{session ? <Dashboard /> : <Signup />}</div>;
};

export default App;
