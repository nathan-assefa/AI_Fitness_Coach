import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertIcon } from "@chakra-ui/react";

const GoogleLoginComponent: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { mutate } = useMutation({
    mutationFn: async (credentialResponse: any) => {
      const token = credentialResponse.credential;
      const apiUrl: string = import.meta.env.VITE_SERVER_URL;
      console.log("google client id: ", credentialResponse);

      const response = await fetch(`${apiUrl}/auth/google/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: token,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to authenticate");
      }
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("authTokens", JSON.stringify(data));
      const llm_id = "1";
      setIsLoading(true);
      setTimeout(() => {
        window.location.href = `/chat-page/${llm_id}`;
        setIsLoading(false);
      }, 3000);
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const handleGoogleAuth = async (credentialResponse: any) => {
    mutate(credentialResponse);
  };

  return (
    <div>
      <GoogleLogin
        onSuccess={handleGoogleAuth}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      {isLoading ? (
        <div className="user-logs-in-using-google">
          <Alert status="success">
            <AlertIcon />
            Congratulations! You have successfully logged in.
          </Alert>
        </div>
      ) : null}
    </div>
  );
};

export default GoogleLoginComponent;
