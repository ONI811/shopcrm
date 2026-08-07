import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api";

const AuthContext = createContext(null);

// AuthProvider showcases React STATE: the user/token pair lives in one
// place and every screen that needs "who is logged in" reads it from here
// instead of re-fetching or duplicating it.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("shopcrm_token");
    const savedUser = localStorage.getItem("shopcrm_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setReady(true);
  }, []);

  function persist(nextToken, nextUser) {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem("shopcrm_token", nextToken);
    localStorage.setItem("shopcrm_user", JSON.stringify(nextUser));
  }

  async function login(email, password) {
    const data = await api.login({ email, password });
    persist(data.token, data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await api.register({ name, email, password });
    persist(data.token, data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
    localStorage.removeItem("shopcrm_token");
    localStorage.removeItem("shopcrm_user");
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
