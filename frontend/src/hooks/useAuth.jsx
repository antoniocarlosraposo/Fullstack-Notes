import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../services/api";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [data, setData] = useState({
    user: localStorage.getItem("@fullstacknotes:user") ?? undefined,
    token: localStorage.getItem("@fullstacknotes:token") ?? undefined,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("@fullstacknotes:token");
    const user = localStorage.getItem("@fullstacknotes:user");

    if (token & user) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setData({
        token,
        user: JSON.parse(user),
      });
    }

    setLoading(false);
  }, []);

  async function signIn({ email, password }) {
    try {
      const response = await api.post("/users/login", { email, password });

      const { token, user } = response.data;

      localStorage.setItem("@fullstacknotes:token", token);
      localStorage.setItem("@fullstacknotes:user", JSON.stringify(user));

      setData({ token, user });
    } catch (error) {
      console.log(error);
    }
  }

  async function signOut() {
    localStorage.removeItem("@fullstacknotes:token");
    localStorage.removeItem("@fullstacknotes:user");

    setData({});
  }

  return (
    <AuthContext.Provider value={{ signIn, signOut, user: data.user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export { AuthProvider, useAuth };
