import React, { useState, createContext, useContext } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  loginUser: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  logOutUser: () => void;
  email: string | null;
  first_name: string | null;
  userId: string | null;
  accessToken: string | null;
  gender: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  return useContext(AuthContext)!;
}

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [gender, setGender] = useState<string | null>("");
  const apiUrl: string = import.meta.env.VITE_SERVER_URL;

  const authRelatedData = localStorage.getItem("authTokens");
  const initialAuthToken = authRelatedData ? JSON.parse(authRelatedData) : null;
  const initialUser = initialAuthToken
    ? jwt_decode<{ email: string }>(initialAuthToken.access).email
    : null;
  const userId = initialAuthToken
    ? jwt_decode<{ id: string }>(initialAuthToken.access).id
    : null;
  const first_name = initialAuthToken
    ? jwt_decode<{ first_name: string }>(initialAuthToken.access).first_name
    : null;

  const [user, setUser] = useState<string | null>(initialUser);

  const accessToken = initialAuthToken ? initialAuthToken.access : null;

  const loginUser = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void> => {
    const response = await fetch(`${apiUrl}/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.status === 200) {
      const accessToken = data.access;
      setUser(jwt_decode<{ email: string }>(accessToken).email);
      setGender(jwt_decode<{ gender: string }>(accessToken).gender);

      localStorage.setItem("authTokens", JSON.stringify(data));
      const llm_id = "1";

      navigate(`/chat-page/${llm_id}#scroll`);
    } else {
      alert("Something went wrong");
    }
  };

  const logOutUser = () => {
    setUser(null);
    localStorage.removeItem("authTokens");
    navigate("/auth-page");
  };

  const contextData = {
    loginUser,
    logOutUser,
    email: user,
    userId,
    first_name,
    accessToken,
    gender,
  };

  return (
    <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
  );
}
